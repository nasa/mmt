import React, {
  useEffect,
  useRef,
  useState
} from 'react'
import { useMutation } from '@apollo/client'
import { isEqual } from 'lodash-es'
import {
  Navigate,
  useNavigate,
  useParams
} from 'react-router'
import Alert from 'react-bootstrap/Alert'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'

import Button from '@/js/components/Button/Button'
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

  // Once this page is left -- by any path -- the selection has served its purpose. Clearing
  // it here (not just on specific buttons) covers every exit uniformly, and avoids leaving
  // a stale selection for a later, unrelated visit to All Collections.
  useEffect(() => () => {
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
          // Skip restoring if the collection has already been re-added since removal,
          // since re-adding it again at that point would be surprising.
          if (selectedCollectionsRef.current.includes(conceptId)) return

          selectCollections([removedCollection])
        }
      },
      message: 'Collection removed from selection',
      variant: 'success'
    })
  }

  // Builds the prepopulated updateValue JSON for the given field/type combination, or '{}'
  // when the combination doesn't need one yet (no field, or a type like FIND_AND_REMOVE
  // that doesn't use updateValue at all).
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

  // FindValue holds raw, uncoerced input strings (see BulkActionsFindValueForm) -- a
  // 'number' key is only valid as a whole number, so flag anything else (a fraction,
  // "abc", etc.) rather than silently dropping it from the submitted request.
  const getFindValueErrors = (rawFindValue, flatFindKeys) => (
    flatFindKeys
      .filter(({ key, type }) => type === 'number' && key in rawFindValue)
      .filter(({ key }) => !Number.isInteger(Number(rawFindValue[key])))
      .map(({ key }) => `${key} must be a whole number`)
  )

  const getEffectiveFindValue = (rawFindValue, flatFindKeys) => {
    const numberKeys = new Set(
      flatFindKeys.filter(({ type }) => type === 'number').map(({ key }) => key)
    )

    return Object.fromEntries(
      Object.entries(rawFindValue).map(([key, rawValue]) => (
        [key, numberKeys.has(key) ? Number(rawValue) : rawValue]
      ))
    )
  }

  let effectiveFindValue
  let findValueErrors = []

  if (fieldConfig && needsFindValue) {
    findValueErrors = getFindValueErrors(findValue, fieldConfig.flatFindKeys)

    if (findValueErrors.length === 0) {
      effectiveFindValue = getEffectiveFindValue(findValue, fieldConfig.flatFindKeys)
    }
  }

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
      isUpdateValueUnfilled = isEqual(
        parsedUpdateValue,
        JSON.parse(buildSkeletonJson(fieldConfig, typeConfig))
      )
    }
  }

  const getEffectiveUpdateValue = () => {
    if (!needsUpdateValue) return undefined

    if (isHomePageUrlType) return buildDataCenterHomePageUrlUpdateValue(homePageUrl)

    return parsedUpdateValue
  }

  const canSubmit = (
    selectedCollections.length > 0
    && !!fieldConfig
    && !!typeConfig
    && (!needsFindValue || (hasFilledEntry([findValue]) && findValueErrors.length === 0))
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
      findValue: needsFindValue ? effectiveFindValue : undefined,
      providerId: selectedProvider,
      updateField,
      updateType,
      updateValue: getEffectiveUpdateValue()
    }

    // eslint-disable-next-line no-console
    console.log('createBulkUpdateCollectionTask variables:', variables)

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

  const handleCancel = () => {
    skipNavigationGuardRef.current = true
    navigate(`/${conceptType}`)
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
              <Form.Group className="mb-3" controlId="bulk-actions-update-type">
                <Form.Label className="fw-bold">Action Type</Form.Label>
                <Form.Select
                  value={updateType}
                  onChange={(event) => handleTypeChange(event.target.value)}
                >
                  <option value="">Select an action type</option>
                  {
                    getBulkUpdateTypes(conceptType)
                      .filter(({ value }) => (
                        isUpdateTypeAvailableForField(conceptType, value, updateField)
                      ))
                      .map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))
                  }
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3" controlId="bulk-actions-update-field">
                <Form.Label className="fw-bold">Target Field</Form.Label>
                <Form.Select
                  value={updateField}
                  onChange={(event) => handleFieldChange(event.target.value)}
                >
                  <option value="">Select a target field</option>
                  {
                    getBulkUpdateFields(conceptType).map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
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
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mt-4 mb-3">
                  <h3 className="h6 fw-bold mb-0">Find</h3>
                  {
                    findValueErrors.length > 0 && (
                      <span className="text-danger small text-end">
                        {findValueErrors.join('; ')}
                      </span>
                    )
                  }
                </div>
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
                  <Form.Label>Home Page URL</Form.Label>
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

      <BulkActionsEditNavigationGuard skipRef={skipNavigationGuardRef} />
    </Page>
  )
}

export default BulkActionsEditPage
