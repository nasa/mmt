import React, {
  useEffect,
  useMemo,
  useState
} from 'react'
import PropTypes from 'prop-types'
import { useLazyQuery } from '@apollo/client'
import { isEqual } from 'lodash-es'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/ListGroupItem'
import Spinner from 'react-bootstrap/Spinner'
import { json } from '@codemirror/lang-json'
import CodeMirrorMerge from 'react-codemirror-merge'

import { GET_COLLECTIONS } from '@/js/operations/queries/getCollections'
import { GET_COLLECTION } from '@/js/operations/queries/getCollection'

import CustomModal from '@/js/components/CustomModal/CustomModal'
import For from '@/js/components/For/For'

import errorLogger from '@/js/utils/errorLogger'

import './SaveAsDraftToExistingCollectionModal.scss'

const { Original, Modified } = CodeMirrorMerge

/**
 * @typedef {Object} SaveAsDraftToExistingCollectionModalProps
 * @property {Boolean} show Should the modal be open.
 * @property {Function} toggleModal A callback function called when the modal is closed with a boolean representing its next state.
 * @property {Object} metadata The staged UMM-C metadata being saved.
 * @property {Function} onConfirm A callback function called with the existing collection's (nativeId, providerId) once the user confirms the diff.
 */

/**
 * Renders a SaveAsDraftToExistingCollectionModal component.
 *
 * Searches CMR for a published collection with a matching
 * ShortName. If exactly one is found it is used as the target automatically; if more
 * than one is found the user is asked to choose which one is the intended target. Once
 * a target is chosen, its published metadata is compared against the staged metadata in
 * a diff viewer before the user confirms saving the staged metadata as a draft under the
 * target's existing nativeId/providerId.
 *
 * @component
 * @example <caption>Render a SaveAsDraftToExistingCollectionModal</caption>
 * return (
 *   <SaveAsDraftToExistingCollectionModal
 *      show={showSaveToExistingModal}
 *      toggleModal={setShowSaveToExistingModal}
 *      metadata={metadata}
 *      onConfirm={(nativeId, providerId) => ingestMutation('Collection', metadata, nativeId, providerId)}
 *   />
 * )
 */
const SaveAsDraftToExistingCollectionModal = ({
  show,
  toggleModal,
  metadata,
  onConfirm
}) => {
  // Status: 'searching' | 'no-match' | 'select-match' | 'loading-target' | 'diff-confirm' | 'error'
  const [status, setStatus] = useState('searching')
  const [errorMessage, setErrorMessage] = useState(null)
  const [matches, setMatches] = useState([])
  const [selectedConceptId, setSelectedConceptId] = useState(null)
  const [targetCollection, setTargetCollection] = useState(null)

  const { ShortName: shortName } = metadata || {}

  const [searchCollections] = useLazyQuery(GET_COLLECTIONS)
  const [getCollection] = useLazyQuery(GET_COLLECTION)

  // Memoized so CodeMirrorMerge doesn't re-initialize its editors on every render
  const readOnlyExtensions = useMemo(() => [json()], [])

  const fetchTargetCollection = (conceptId) => {
    setStatus('loading-target')

    getCollection({
      variables: {
        params: { conceptId }
      },
      onCompleted: (data) => {
        const { collection } = data

        if (!collection) {
          setErrorMessage('The matching collection could not be retrieved.')
          setStatus('error')

          return
        }

        setTargetCollection(collection)
        setStatus('diff-confirm')
      },
      onError: (fetchError) => {
        errorLogger(fetchError, 'SaveAsDraftToExistingCollectionModal: getCollection')
        setErrorMessage(fetchError.message)
        setStatus('error')
      }
    })
  }

  // Resets state and kicks off the ShortName search each time the modal is opened
  useEffect(() => {
    if (!show) return

    setStatus('searching')
    setErrorMessage(null)
    setMatches([])
    setSelectedConceptId(null)
    setTargetCollection(null)

    searchCollections({
      variables: {
        params: { shortName }
      },
      onCompleted: (data) => {
        const { collections } = data
        const { items } = collections

        if (!items || items.length === 0) {
          setStatus('no-match')

          return
        }

        if (items.length === 1) {
          fetchTargetCollection(items[0].conceptId)

          return
        }

        setMatches(items)
        setStatus('select-match')
      },
      onError: (searchError) => {
        errorLogger(searchError, 'SaveAsDraftToExistingCollectionModal: getCollections')
        setErrorMessage(searchError.message)
        setStatus('error')
      }
    })
  }, [show])

  const handleConfirm = () => {
    const { nativeId, providerId } = targetCollection

    onConfirm(nativeId, providerId)
    toggleModal(false)
  }

  const renderMessage = () => {
    if (status === 'searching' || status === 'loading-target') {
      return (
        <div className="d-flex align-items-center justify-content-center py-4">
          <Spinner
            animation="border"
            role="status"
            className="me-2"
          />
          {
            status === 'searching'
              ? `Searching for a published collection with ShortName "${shortName}"…`
              : 'Loading the matching collection…'
          }
        </div>
      )
    }

    if (status === 'no-match') {
      return (
        <Alert variant="warning">
          {`No published collection was found with ShortName "${shortName}". Use "Save as New Draft" instead, or verify the ShortName is correct.`}
        </Alert>
      )
    }

    if (status === 'select-match') {
      return (
        <>
          <p>
            {`More than one published collection was found with ShortName "${shortName}". Choose the collection this draft should update.`}
          </p>
          <ListGroup>
            <For each={matches}>
              {
                (match) => {
                  const {
                    conceptId,
                    entryTitle,
                    provider,
                    version
                  } = match

                  return (
                    <ListGroupItem key={conceptId}>
                      <Form.Check
                        checked={selectedConceptId === conceptId}
                        id={`save-as-draft-to-existing-collection-match_${conceptId}`}
                        label={`${entryTitle} — Provider: ${provider}, Version: ${version}, Concept ID: ${conceptId}`}
                        name="save-as-draft-to-existing-collection-match"
                        onChange={() => setSelectedConceptId(conceptId)}
                        type="radio"
                      />
                    </ListGroupItem>
                  )
                }
              }
            </For>
          </ListGroup>
        </>
      )
    }

    if (status === 'diff-confirm') {
      const { ummMetadata } = targetCollection
      const hasNoDifferences = isEqual(ummMetadata, metadata)

      return (
        <>
          <p>
            {
              hasNoDifferences
                ? 'Confirming will save the staged metadata as a draft under the existing collection, so publishing it will update this collection instead of creating a duplicate.'
                : `Review the differences between the existing published collection (left) and the
            staged metadata (right). Confirming will save the staged metadata as a draft under
            the existing collection, so publishing it will update this collection instead of
            creating a duplicate.`
            }
          </p>
          {
            hasNoDifferences
              ? (
                <Alert variant="info">
                  No differences were found between the existing published collection and the
                  staged metadata.
                </Alert>
              )
              : (
                <div className="save-as-draft-to-existing-collection-modal__diff">
                  <div className="save-as-draft-to-existing-collection-modal__diff-labels d-flex justify-content-between small text-muted mb-1">
                    <span>Existing published collection</span>
                    <span>Staged metadata</span>
                  </div>
                  <CodeMirrorMerge
                    orientation="a-b"
                    collapseUnchanged={
                      {
                        margin: 3,
                        minSize: 10
                      }
                    }
                  >
                    <Original
                      value={JSON.stringify(ummMetadata, null, 2)}
                      extensions={readOnlyExtensions}
                      editable={false}
                    />
                    <Modified
                      value={JSON.stringify(metadata, null, 2)}
                      extensions={readOnlyExtensions}
                      editable={false}
                    />
                  </CodeMirrorMerge>
                </div>
              )
          }
        </>
      )
    }

    return (
      <Alert variant="danger">
        {errorMessage || 'An error occurred while searching for a matching collection.'}
      </Alert>
    )
  }

  const getActions = () => {
    if (status === 'searching' || status === 'loading-target') {
      return null
    }

    if (status === 'select-match') {
      return [
        {
          label: 'Cancel',
          variant: 'secondary',
          onClick: () => toggleModal(false)
        },
        {
          label: 'Continue',
          variant: 'primary',
          disabled: !selectedConceptId,
          onClick: () => fetchTargetCollection(selectedConceptId)
        }
      ]
    }

    if (status === 'diff-confirm') {
      return [
        {
          label: 'Cancel',
          variant: 'secondary',
          onClick: () => toggleModal(false)
        },
        {
          label: 'Save as Draft',
          variant: 'success',
          onClick: handleConfirm
        }
      ]
    }

    return [
      {
        label: 'Close',
        variant: 'primary',
        onClick: () => toggleModal(false)
      }
    ]
  }

  return (
    <CustomModal
      header="Save as Draft to Existing Collection"
      show={show}
      showCloseButton={status !== 'searching' && status !== 'loading-target'}
      size="xl"
      toggleModal={
        (nextState) => {
          if (!nextState && (status === 'searching' || status === 'loading-target')) return

          toggleModal(nextState)
        }
      }
      message={renderMessage()}
      actions={getActions()}
    />
  )
}

SaveAsDraftToExistingCollectionModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  metadata: PropTypes.object,
  onConfirm: PropTypes.func.isRequired
}

SaveAsDraftToExistingCollectionModal.defaultProps = {
  metadata: null
}

export default SaveAsDraftToExistingCollectionModal
