import React, { useEffect, useState } from 'react'
import {
  Button,
  Placeholder,
  Table
} from 'react-bootstrap'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { useLazyQuery, useMutation } from '@apollo/client'
import Form from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'
import camelcaseKeys from 'camelcase-keys'
import { useNavigate, useParams } from 'react-router'
import pluralize from 'pluralize'
import Page from '../Page/Page'
import For from '../For/For'
import { GET_COLLECTIONS } from '../../operations/queries/getCollections'
import useAppContext from '../../hooks/useAppContext'
import collectionAssociation from '../../schemas/collectionAssociation'
import OneOfField from '../OneOfField/OneOfField'
import CustomTextWidget from '../CustomTextWidget/CustomTextWidget'
import CustomDateTimeWidget from '../CustomDateTimeWidget/CustomDateTimeWidget'
import CustomSelectWidget from '../CustomSelectWidget/CustomSelectWidget'
import CustomTitleField from '../CustomTitleField/CustomTitleField'
import GridLayout from '../GridLayout/GridLayout'
import CustomFieldTemplate from '../CustomFieldTemplate/CustomFieldTemplate'
import getConceptTypeByDraftConceptId from '../../utils/getConceptTypeByDraftConceptId'
import conceptTypeDraftQueries from '../../constants/conceptTypeDraftQueries'
import LoadingBanner from '../LoadingBanner/LoadingBanner'
import parseError from '../../utils/parseError'
import ErrorBanner from '../ErrorBanner/ErrorBanner'
import errorLogger from '../../utils/errorLogger'
import { INGEST_DRAFT } from '../../operations/mutations/ingestDraft'
import getUmmVersion from '../../utils/getUmmVersion'
import useNotificationsContext from '../../hooks/useNotificationsContext'

const CollectionAssociation = () => {
  const { conceptId } = useParams()
  const navigate = useNavigate()

  const { user } = useAppContext()
  const { providerId } = user

  const [error, setError] = useState()
  const [selectedOption, setSelectedOption] = useState()
  const [fetchedDraft, setFetchedDraft] = useState()
  const [collectionSearchResult, setCollectionSearchResult] = useState({})
  const [showSelectCollection, setShowSelectCollection] = useState(false)
  const [loading, setLoading] = useState()

  const [ingestDraftMutation] = useMutation(INGEST_DRAFT)
  const derivedConceptType = getConceptTypeByDraftConceptId(conceptId)

  const { addNotification } = useNotificationsContext()

  const fields = {
    OneOfField,
    TitleField: CustomTitleField,
    layout: GridLayout
  }

  const templates = {
    FieldTemplate: CustomFieldTemplate

  }

  const widgets = {
    TextWidget: CustomTextWidget,
    DateTimeWidget: CustomDateTimeWidget,
    SelectWidget: CustomSelectWidget
  }

  const [getDraft] = useLazyQuery(conceptTypeDraftQueries[derivedConceptType], {
    variables: {
      params: {
        conceptId,
        conceptType: derivedConceptType
      }
    },
    onCompleted: (getDraftData) => {
      const { draft } = getDraftData
      setFetchedDraft(draft)
      setLoading(false)
    },
    onError: (getDraftError) => {
      setLoading(false)
      errorLogger('Unable to retrieve draft', 'Collection Association: getDraft Query')

      setError(getDraftError)
    }
  })

  useEffect(() => {
    // SetLoading(true)
    getDraft()
  }, [])

  // Calls GET_COLLECTION query and
  const [getCollections] = useLazyQuery(GET_COLLECTIONS, {
    onCompleted: (getCollectionsData) => {
      setCollectionSearchResult(getCollectionsData.collections)
      setLoading(false)
    },
    onError: (getCollectionsError) => {
      setLoading(false)
      console.log('error:', getCollectionsError)
    }
  })

  // Handles on submit from the form. Calls graphQL with a wildcard search
  // Example:
  //   "params": {
  //   "options": {
  //     "shortName": {
  //     "pattern": true
  //     }
  //   },
  //   "shortName": "*"
  const handleCollectionSearch = ({ formData }) => {
    const formattedFormData = camelcaseKeys(formData, { deep: true })

    const { searchField } = formattedFormData
    const type = Object.keys(searchField)
    const value = Object.values(searchField).at(0)

    setLoading(true)
    setShowSelectCollection(true)

    getCollections({
      variables: {
        params: {
          options: {
            [type]: {
              pattern: true
            }
          },
          [type]: value
        }
      }
    })
  }

  const handleSubmit = () => {
    let associationDetailDraft = fetchedDraft
    const { ummMetadata } = fetchedDraft
    const { nativeId } = fetchedDraft

    associationDetailDraft = {
      ...ummMetadata,
      __private: { CollectionAssociation: selectedOption }
    }

    ingestDraftMutation({
      variables: {
        conceptType: derivedConceptType,
        metadata: associationDetailDraft,
        nativeId,
        providerId,
        ummVersion: getUmmVersion(derivedConceptType)
      },
      onCompleted: () => {
        // Console.log('🚀 ~ handleSubmit ~ getIngestData:', getIngestData)
        // Add a success notification
        addNotification({
          message: ` ${conceptId} Associated`,
          variant: 'success'
        })

        navigate(`/drafts/${pluralize(derivedConceptType).toLowerCase()}/${conceptId}`, { replace: true })
      },
      onError: (getIngestError) => {
        console.log('🚀 ~ handleSubmit ~ getIngestError:', getIngestError)
      }
    })
  }

  // If (loading) {
  //   return (
  //     <Page>
  //       <LoadingBanner />
  //     </Page>
  //   )
  // }

  if (error) {
    const message = parseError(error)

    return (
      <Page>
        <ErrorBanner message={message} />
      </Page>
    )
  }

  const { items = [], count } = collectionSearchResult || {}
  const { ummMetadata } = fetchedDraft || {}
  const { __private } = ummMetadata || {}
  const { CollectionAssociation } = __private || 0

  let size = 0
  if (CollectionAssociation) {
    size = Object.keys(CollectionAssociation).length
  }

  return (
    <Page>
      <h4>Collection Association Search</h4>
      <Row className="m-5">

        {/* Currently Selected Collections */}
        <Col sm={12} className="pb-5">
          <h5>Currently Selected Collection</h5>
          <Table striped>
            <thead>
              <tr>
                <th>Collection</th>
                <th>Short Name</th>
                <th>Version</th>
              </tr>
            </thead>
          </Table>
          <Button>Clear Collection Association</Button>
        </Col>
        <Form
          schema={collectionAssociation}
          validator={validator}
          fields={fields}
          widgets={widgets}
          templates={templates}
          onSubmit={handleCollectionSearch}
        />
        <Col sm={12} className="mt-5">
          {
            showSelectCollection
            && (
              <>
                <h5>Select Collection</h5>
                <h6>
                  Showing
                  {' '}
                  {count}
                  {' '}
                  Collections
                </h6>
                <Table striped>
                  <thead>
                    <tr>
                      <th />
                      <th>Collection</th>
                      <th>Short Name</th>
                      <th>Version</th>
                      <th>Provider</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      loading ? (
                        <For each={[...new Array(5)]}>
                          {
                            (item, i) => (
                              <tr key={`placeholder-row_${i}`}>
                                <td className="col-md-4">
                                  <Placeholder animation="glow">
                                    <Placeholder xs={6} />
                                  </Placeholder>
                                </td>
                                <td className="col-md-4">
                                  <Placeholder animation="glow">
                                    <Placeholder xs={6} />
                                  </Placeholder>
                                </td>
                                <td className="col-md-4">
                                  <Placeholder animation="glow">
                                    <Placeholder xs={6} />
                                  </Placeholder>
                                </td>
                                <td className="col-md-4">
                                  <Placeholder animation="glow">
                                    <Placeholder xs={6} />
                                  </Placeholder>
                                </td>
                                <td className="col-md-4">
                                  <Placeholder animation="glow">
                                    <Placeholder xs={6} />
                                  </Placeholder>
                                </td>
                              </tr>
                            )
                          }
                        </For>
                      ) : (
                        <For
                          each={items}
                          empty={
                            (
                              <tr>
                                <td>No collections found.</td>
                              </tr>
                            )
                          }
                        >
                          {
                            (
                              {
                                conceptId,
                                shortName,
                                version,
                                provider,
                                title
                              }
                            ) => (
                              <tr key={conceptId}>
                                <td>
                                  <input
                                    id={conceptId}
                                    type="radio"
                                    name="select-collection"
                                    value={conceptId}
                                    onClick={
                                      () => {
                                        setSelectedOption({
                                          conceptId,
                                          shortName,
                                          version
                                        })
                                      }
                                    }
                                  />
                                </td>
                                <td className="col-md-4">{title}</td>
                                <td className="col-md-4">{shortName}</td>
                                <td className="col-md-4">{version}</td>
                                <td className="col-md-4">{provider}</td>
                              </tr>
                            )
                          }
                        </For>
                      )
                    }
                  </tbody>
                </Table>
                <Button
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </>
            )
          }
        </Col>
      </Row>
    </Page>
  )
}

export default CollectionAssociation
