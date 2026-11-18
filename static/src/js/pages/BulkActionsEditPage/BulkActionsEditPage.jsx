import React, {
  useEffect,
  useRef,
  useState
} from 'react'
import { useMutation } from '@apollo/client'
import {
  Navigate,
  useNavigate,
  useParams
} from 'react-router'
import Alert from 'react-bootstrap/Alert'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Row from 'react-bootstrap/Row'
import Tooltip from 'react-bootstrap/Tooltip'
import { FaInfoCircle } from 'react-icons/fa'

import Button from '@/js/components/Button/Button'
import BulkActionsControlledValuePicker from '@/js/components/BulkActionsControlledValuePicker/BulkActionsControlledValuePicker'
import BulkActionsEditNavigationGuard from '@/js/components/BulkActionsEditNavigationGuard/BulkActionsEditNavigationGuard'
import BulkActionsFindValueForm from '@/js/components/BulkActionsFindValueForm/BulkActionsFindValueForm'
import BulkActionsSelectedConcepts from '@/js/components/BulkActionsSelectedConcepts/BulkActionsSelectedConcepts'
import BulkActionsSubmittedModal from '@/js/components/BulkActionsSubmittedModal/BulkActionsSubmittedModal'
import BulkActionsUpdateValueEditor from '@/js/components/BulkActionsUpdateValueEditor/BulkActionsUpdateValueEditor'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'

import {
  getBulkActionsSelectedListAdapter,
  getBulkUpdateFieldConfig,
  getBulkUpdateFields,
  getBulkUpdateTypeConfig,
  getBulkUpdateTypes,
  isBulkUpdateSupportedForConceptType,
  isUpdateTypeAvailableForField
} from '@/js/constants/bulkUpdateFields'

import useCollectionSelectionContext from '@/js/hooks/useCollectionSelectionContext'
import useNotificationsContext from '@/js/hooks/useNotificationsContext'

import {
  CREATE_BULK_UPDATE_COLLECTION_TASK
} from '@/js/operations/mutations/createBulkUpdateCollectionTask'

import buildDataCenterHomePageUrlUpdateValue from '@/js/utils/buildDataCenterHomePageUrlUpdateValue'
import buildUpdateValueJsonSchema from '@/js/utils/buildUpdateValueJsonSchema'
import buildUpdateValueJsonSkeleton from '@/js/utils/buildUpdateValueJsonSkeleton'
import errorLogger from '@/js/utils/errorLogger'
import getUpdateValueJsonErrors from '@/js/utils/getUpdateValueJsonErrors'
import stripUnfilledUpdateValueFields from '@/js/utils/stripUnfilledUpdateValueFields'

const HOME_PAGE_URL_TYPE = 'FIND_AND_UPDATE_HOME_PAGE_URL'

// Labeled per the actual effect of each update type, not just whether it needs a find value:
// ADD_TO_EXISTING adds; CLEAR_ALL_AND_REPLACE and FIND_AND_REPLACE replace the whole entry;
// FIND_AND_UPDATE only merges the fields present, leaving the rest of the entry alone.
const UPDATE_VALUE_SECTION_LABELS = {
  ADD_TO_EXISTING: 'Add',
  CLEAR_ALL_AND_REPLACE: 'Replace With',
  FIND_AND_REPLACE: 'Replace With',
  FIND_AND_UPDATE: 'Update With'
}

// ADD_TO_EXISTING adds a brand new entry -- there's no existing value for a blank/null key to
// "remove", and a key the schema marks required (see buildUpdateValueJsonSchema) must still
// be non-blank and can never be null. CLEAR_ALL_AND_REPLACE/FIND_AND_REPLACE overwrite the whole
// matched entry (see typeConfig.helpText above) under the same required-field rule, so a key
// left blank/deleted there is left out of the replacement, not kept from the existing entry.
// FIND_AND_UPDATE's partial merge really does keep/remove a field on the existing entry --
// except a required one, which (like the other action types) can never be set to null, even
// though it's still fine to leave blank/untouched there.
const UPDATE_VALUE_JSON_HELP_TEXT = {
  ADD_TO_EXISTING: "Delete a key or leave it blank to leave it out of the new entry. A key marked required can't be left blank or set to null.",
  CLEAR_ALL_AND_REPLACE: "This replaces the whole entry, so a key left blank or deleted is left out of it, not kept from the entry it's replacing. A key marked required can't be left blank or set to null.",
  FIND_AND_REPLACE: "This replaces the whole entry, so a key left blank or deleted is left out of it, not kept from the entry it's replacing. A key marked required can't be left blank or set to null.",
  FIND_AND_UPDATE: 'Delete a key or leave it blank to keep the existing value. Set it to null to remove it -- except a key marked required, which can never be set to null.'
}

/**
 * Renders a BulkActionsEditPage component.
 *
 * Lets the user review the collections selected for a bulk update (removing any with an
 * Undo-backed toast instead of a confirmation dialog), choose a target field and action
 * type, fill in the information CMR's native bulk-update endpoint needs for that
 * combination, and submit the bulk update. Reached from the sticky CollectionSelectionBar's
 * "Continue" button, which only renders when at least one collection is selected.
 *
 * @component
 * @example <caption>Render a BulkActionsEditPage</caption>
 * return (
 *   <BulkActionsEditPage />
 * )
 */
const BulkActionsEditPage = () => {
  const navigate = useNavigate()
  const { type: conceptType } = useParams()

  const { addNotification } = useNotificationsContext()

  const {
    clearCollectionSelections,
    deselectCollections,
    selectCollections,
    selectedCollections,
    selectedProvider
  } = useCollectionSelectionContext()

  const [updateField, setUpdateField] = useState('')
  const [updateType, setUpdateType] = useState('')
  const [findValue, setFindValue] = useState({})
  const [updateValueJson, setUpdateValueJson] = useState('{}')
  const [homePageUrl, setHomePageUrl] = useState('')
  const [taskId, setTaskId] = useState(null)
  const [showSubmittedModal, setShowSubmittedModal] = useState(false)

  // Read in the Undo action's onClick instead of closed over, so it reflects whatever
  // selection exists by the time the user clicks Undo rather than the one at remove time.
  const selectedCollectionsRef = useRef(selectedCollections)
  selectedCollectionsRef.current = selectedCollections

  // Set to true right before an already-confirmed exit (Cancel, or post-submit navigation)
  // so the navigation guard's blocker doesn't also warn -- it can't otherwise tell that
  // navigate() call apart from a sidebar link to the same place.
  const skipNavigationGuardRef = useRef(false)

  // The Undo toast (global, independent of this page) can outlive this page by several
  // seconds -- checked by the Undo action below so it doesn't resurrect a selection the
  // unmount cleanup just cleared, on whatever page the user has since moved to.
  const isUnmountedRef = useRef(false)

  // Once this page is left -- by any path -- the selection has served its purpose. Clearing
  // it here (not just on specific buttons) covers every exit uniformly, and avoids leaving
  // a stale selection for a later, unrelated visit to All Collections.
  useEffect(() => () => {
    isUnmountedRef.current = true
    clearCollectionSelections()
  }, [clearCollectionSelections])

  const [createBulkUpdateCollectionTaskMutation, { loading: submitting }] = useMutation(
    CREATE_BULK_UPDATE_COLLECTION_TASK
  )

  const handleRemove = (conceptId) => {
    const removedCollection = {
      conceptId,
      provider: selectedProvider
    }

    deselectCollections([conceptId])

    addNotification({
      action: {
        label: 'Undo',
        onClick: () => {
          if (isUnmountedRef.current) return

          // Skip if already re-added since removal, to avoid adding it a second time.
          if (selectedCollectionsRef.current.includes(conceptId)) return

          selectCollections([removedCollection])
        }
      },
      message: 'Collection removed from selection',
      variant: 'success'
    })
  }

  const buildSkeletonJson = (nextFieldConfig, nextTypeConfig) => {
    const { updateValueFields } = nextFieldConfig || {}
    const {
      needsUpdateValue: nextNeedsUpdateValue,
      supportsMultipleUpdateValues: nextSupportsMultiple
    } = nextTypeConfig || {}

    if (!updateValueFields || !nextNeedsUpdateValue) return '{}'

    return buildUpdateValueJsonSkeleton(updateValueFields, !!nextSupportsMultiple)
  }

  const resetValues = (nextFieldConfig, nextTypeConfig) => {
    setFindValue({})
    setUpdateValueJson(buildSkeletonJson(nextFieldConfig, nextTypeConfig))
    setHomePageUrl('')
  }

  const fieldConfig = getBulkUpdateFieldConfig(conceptType, updateField)
  const typeConfig = getBulkUpdateTypeConfig(conceptType, updateType)
  const { needsFindValue, needsUpdateValue, supportsMultipleUpdateValues } = typeConfig || {}

  const handleFieldChange = (nextField) => {
    setUpdateField(nextField)

    // FIND_AND_UPDATE_HOME_PAGE_URL is only valid for DATA_CENTERS -- clear the selected
    // action type if it's no longer valid for the newly selected field.
    const nextType = (
      updateType && !isUpdateTypeAvailableForField(conceptType, updateType, nextField)
    )
      ? ''
      : updateType

    if (nextType !== updateType) setUpdateType(nextType)

    resetValues(
      getBulkUpdateFieldConfig(conceptType, nextField),
      getBulkUpdateTypeConfig(conceptType, nextType)
    )
  }

  const handleTypeChange = (nextType) => {
    setUpdateType(nextType)
    resetValues(fieldConfig, getBulkUpdateTypeConfig(conceptType, nextType))
  }

  const { query: selectedListQuery, columns: selectedListColumns } = (
    getBulkActionsSelectedListAdapter(conceptType)
  )

  const isHomePageUrlType = updateType === HOME_PAGE_URL_TYPE

  const updateValueSectionLabel = UPDATE_VALUE_SECTION_LABELS[updateType] || 'Update'

  const hasFilledEntry = (entries) => entries.some((entry) => Object.keys(entry).length > 0)

  let parsedUpdateValue
  let updateValueJsonErrors = []
  let isUpdateValueUnfilled = false

  if (fieldConfig && needsUpdateValue && !isHomePageUrlType) {
    const updateValueSchema = buildUpdateValueJsonSchema(
      fieldConfig.updateValueFields,
      !!supportsMultipleUpdateValues
    )

    updateValueJsonErrors = getUpdateValueJsonErrors(updateValueJson, updateValueSchema)

    if (updateValueJsonErrors.length === 0) {
      parsedUpdateValue = JSON.parse(updateValueJson)

      // Comparing against the pristine skeleton (as this used to) misses e.g. adding then
      // removing a controlled-picker entry from a multi-value list -- that leaves the JSON
      // as `[]`, not the skeleton's `[{blank placeholder}]`. Stripping it the same way the
      // submission itself does and checking whether anything real survives covers both shapes.
      const effectiveUpdateValue = stripUnfilledUpdateValueFields(parsedUpdateValue)

      isUpdateValueUnfilled = Array.isArray(effectiveUpdateValue)
        ? effectiveUpdateValue.length === 0
        : Object.keys(effectiveUpdateValue).length === 0
    }
  }

  const getEffectiveUpdateValue = () => {
    if (!needsUpdateValue) return undefined

    if (isHomePageUrlType) return buildDataCenterHomePageUrlUpdateValue(homePageUrl)

    // Strip untouched skeleton placeholders ('', 0, []) before submitting -- the editor
    // prepopulates every field with one so the user can see what's available, but CMR should
    // only ever get the fields actually filled in (an explicit `null` still goes through, as
    // the user's way of saying "remove this field").
    return stripUnfilledUpdateValueFields(parsedUpdateValue)
  }

  const canSubmit = (
    selectedCollections.length > 0
    && !!fieldConfig
    && !!typeConfig
    && (!needsFindValue || hasFilledEntry([findValue]))
    // Leaving the home page URL blank is a valid, intentional "remove it" request, so it
    // skips both the schema and the unfilled-skeleton check below.
    && (
      !needsUpdateValue
      || isHomePageUrlType
      || (updateValueJsonErrors.length === 0 && !isUpdateValueUnfilled)
    )
  )

  const handleSubmit = () => {
    const variables = {
      conceptIds: selectedCollections,
      findValue: needsFindValue ? findValue : undefined,
      providerId: selectedProvider,
      updateField,
      updateType,
      updateValue: getEffectiveUpdateValue()
    }

    createBulkUpdateCollectionTaskMutation({
      variables,
      onCompleted: (mutationData) => {
        const { createBulkUpdateCollectionTask } = mutationData
        const { taskId: newTaskId } = createBulkUpdateCollectionTask

        setTaskId(newTaskId)
        setShowSubmittedModal(true)
      },
      onError: (error) => {
        addNotification({
          message: 'Error submitting bulk update',
          variant: 'danger'
        })

        errorLogger(error, 'Bulk Actions Edit Page: createBulkUpdateCollectionTask Mutation')
      }
    })
  }

  const handleCloseSubmittedModal = () => {
    setShowSubmittedModal(false)
    skipNavigationGuardRef.current = true
    navigate(`/${conceptType}/bulk-actions`)
  }

  const handleViewJobStatus = () => {
    setShowSubmittedModal(false)
    skipNavigationGuardRef.current = true
    navigate(`/${conceptType}/bulk-actions/${taskId}`)
  }

  // Clears the in-progress field/action-type configuration instead of leaving the page --
  // the user's collection selection is untouched, so they can pick a different field/action
  // for the same selection rather than starting over from All Collections.
  const handleCancel = () => {
    setUpdateField('')
    setUpdateType('')
    resetValues()
  }

  // Bulk-update has no configuration for this concept type (only 'collections' exists
  // today) -- rendering below would reach BulkActionsSelectedConcepts with an undefined
  // query and crash, so redirect instead of letting that happen.
  if (!isBulkUpdateSupportedForConceptType(conceptType)) {
    return <Navigate to="/404" replace />
  }

  return (
    <Page
      pageType="secondary"
      header={<PageHeader pageType="secondary" title="Configure Bulk Update" />}
    >
      <p className="text-secondary">
        {`You are configuring an update for ${selectedCollections.length} collection(s).`}
      </p>

      <Card className="mb-4">
        <Card.Header className="fw-bold">Update Parameters</Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="bulk-actions-update-field">
                <Form.Label className="fw-bold">Target Field</Form.Label>
                <Form.Select
                  // Matches the placeholder-grey used elsewhere while nothing's picked yet;
                  // the real options below get "text-body" so they don't inherit it.
                  className={!updateField ? 'text-muted' : undefined}
                  value={updateField}
                  onChange={(event) => handleFieldChange(event.target.value)}
                >
                  <option value="" disabled>Select a target field</option>
                  {
                    getBulkUpdateFields(conceptType).map(({ value, label }) => (
                      <option key={value} value={value} className="text-body">{label}</option>
                    ))
                  }
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3" controlId="bulk-actions-update-type">
                <Form.Label className="fw-bold">Action Type</Form.Label>
                <Form.Select
                  className={!updateType ? 'text-muted' : undefined}
                  value={updateType}
                  onChange={(event) => handleTypeChange(event.target.value)}
                >
                  <option value="" disabled>Select an action type</option>
                  {
                    getBulkUpdateTypes(conceptType)
                      .filter(({ value }) => (
                        isUpdateTypeAvailableForField(conceptType, value, updateField)
                      ))
                      .map(({ value, label }) => (
                        <option key={value} value={value} className="text-body">{label}</option>
                      ))
                  }
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {
            typeConfig && (
              <Alert variant="secondary" className="mt-2">{typeConfig.helpText}</Alert>
            )
          }

          {
            fieldConfig && needsFindValue && (
              <>
                <h3 className="h6 fw-bold mt-4 mb-3">Find</h3>
                <BulkActionsFindValueForm
                  flatFindKeys={fieldConfig.flatFindKeys}
                  value={findValue}
                  onChange={setFindValue}
                />
              </>
            )
          }

          {
            fieldConfig && needsUpdateValue && isHomePageUrlType && (
              <>
                <h3 className="h6 fw-bold mt-4">Update</h3>
                <Form.Group className="mb-3" controlId="bulk-actions-home-page-url">
                  <Form.Label className="fw-bold">Home Page URL</Form.Label>
                  <Form.Control
                    type="text"
                    value={homePageUrl}
                    onChange={(event) => setHomePageUrl(event.target.value)}
                    placeholder="Leave blank to remove the existing home page URL"
                  />
                </Form.Group>
              </>
            )
          }

          {
            fieldConfig && needsUpdateValue && !isHomePageUrlType && (
              <>
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mt-4 mb-3">
                  <h3 className="h6 fw-bold mb-0">{updateValueSectionLabel}</h3>
                </div>
                <BulkActionsControlledValuePicker
                  // Platforms/Instruments/Data Centers all render the same underlying
                  // BulkActionsControlledEntryList, and ADD_TO_EXISTING/FIND_AND_UPDATE on the
                  // same field only differ by allowMultiple -- without this key, switching
                  // between any of those reuses that instance and leaks its in-progress,
                  // not-yet-added pick (BulkActionsControlledEntryList's own pendingEntry)
                  // into the new field/type instead of starting fresh.
                  key={`${updateField}-${updateType}`}
                  fieldConfig={fieldConfig}
                  allowMultiple={!!supportsMultipleUpdateValues}
                  value={updateValueJson}
                  onChange={setUpdateValueJson}
                />
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mt-3 mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="small fw-semibold text-secondary">
                      What will be sent to CMR
                    </span>
                    <OverlayTrigger
                      overlay={
                        (
                          <Tooltip id="update-value-json-help">
                            {UPDATE_VALUE_JSON_HELP_TEXT[updateType]}
                          </Tooltip>
                        )
                      }
                      placement="top"
                    >
                      <button
                        type="button"
                        aria-label="help"
                        className="bg-transparent border-0 p-0 d-inline-flex focus-ring"
                      >
                        <FaInfoCircle className="text-secondary" />
                      </button>
                    </OverlayTrigger>
                  </div>
                  {
                    updateValueJsonErrors.length > 0 && (
                      <span className="text-danger small text-end">
                        {updateValueJsonErrors.join('; ')}
                      </span>
                    )
                  }
                </div>
                <BulkActionsUpdateValueEditor
                  fields={fieldConfig.updateValueFields}
                  allowMultiple={!!supportsMultipleUpdateValues}
                  value={updateValueJson}
                  onChange={setUpdateValueJson}
                />
              </>
            )
          }
        </Card.Body>
      </Card>

      {
        updateField && updateType && (
          <div className="d-flex justify-content-end mb-4">
            <Button
              className="me-2"
              disabled={submitting}
              onClick={handleCancel}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              disabled={!canSubmit || submitting}
              loading={submitting}
              loadingText="Submitting…"
              onClick={handleSubmit}
              variant="primary"
            >
              Submit Bulk Action
            </Button>
          </div>
        )
      }

      <Card className="mb-4">
        <Card.Header className="fw-bold">Selected Collections</Card.Header>
        <Card.Body>
          <BulkActionsSelectedConcepts
            conceptIds={selectedCollections}
            onRemove={handleRemove}
            query={selectedListQuery}
            columns={selectedListColumns}
            noSelectionMessage="No collections are selected. Go back to All Collections to select collections to update."
            loadingMessage="Loading selected collections…"
          />
        </Card.Body>
      </Card>

      <BulkActionsSubmittedModal
        onClose={handleCloseSubmittedModal}
        onViewJobStatus={handleViewJobStatus}
        show={showSubmittedModal}
        taskId={taskId}
      />

      <BulkActionsEditNavigationGuard skipRef={skipNavigationGuardRef} submitting={submitting} />
    </Page>
  )
}

export default BulkActionsEditPage
