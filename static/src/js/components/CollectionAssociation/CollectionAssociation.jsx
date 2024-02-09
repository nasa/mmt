import React, { useEffect, useState } from 'react'
import BootstrapTable from 'react-bootstrap/Table'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { useLazyQuery, useMutation } from '@apollo/client'
import Form from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'
import camelcaseKeys from 'camelcase-keys'
import { useNavigate, useParams } from 'react-router'
import pluralize from 'pluralize'
import { FaArrowAltCircleRight } from 'react-icons/fa'
import BootstrapSelect from 'react-bootstrap/Button'
import Button from '../Button/Button'
import Page from '../Page/Page'
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
import Table from '../Table/Table'
import removeMetadataKeys from '../../utils/removeMetadataKeys'
import collectionAssociationUiSchema from '../../schemas/uiSchemas/CollectionAssociation'

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
  const [collectionLoading, setCollectionLoading] = useState()
  const [savedFormData, setSavedFormData] = useState()
  const [currentSelectedAssociation, setCurrentSelectedAssociation] = useState({})
  const [searchFormData, setSearchFormData] = useState({})
  const [offset, setOffset] = useState(0)
  const limit = 20

  const [ingestDraftMutation] = useMutation(INGEST_DRAFT)
  const derivedConceptType = getConceptTypeByDraftConceptId(conceptId)
  const [focusField, setFocusField] = useState(null)

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
      const { ummMetadata } = draft
      const { _private } = ummMetadata
      const { CollectionAssociation: savedAssociation } = _private || {}

      setFetchedDraft(draft)
      setCurrentSelectedAssociation(savedAssociation)
      setLoading(false)
    },
    onError: (getDraftError) => {
      setLoading(false)
      errorLogger('Unable to retrieve draft', 'Collection Association: getDraft Query')

      setError(getDraftError)
    }
  })

  useEffect(() => {
    setLoading(true)
    getDraft()
  }, [])

  // Calls GET_COLLECTION query and
  const [getCollections] = useLazyQuery(GET_COLLECTIONS, {
    onCompleted: (getCollectionsData) => {
      setCollectionSearchResult(getCollectionsData.collections)
      setCollectionLoading(false)
      // SetSearchFormData(null)
    },
    onError: (getCollectionsError) => {
      setCollectionLoading(false)
      console.log('error:', getCollectionsError)
    }
  })

  const isWildCardSearch = (type) => {
    const wildcardSearch = ['dataCenter', 'platform', 'project', 'shortName']

    return wildcardSearch.includes(type[0])
  }

  const handleCollectionSearch = () => {
    setSavedFormData(searchFormData)
    const formattedFormData = camelcaseKeys(searchFormData, { deep: true })

    const { searchField, providerFilter } = formattedFormData

    let provider = null
    if (providerFilter) {
      provider = providerId
    }

    const type = Object.keys(searchField)
    console.log('🚀 ~ handleCollectionSearch ~ type:', type)
    const value = Object.values(searchField).at(0)

    setCollectionLoading(true)
    setShowSelectCollection(true)

    let query = {}
    if (isWildCardSearch(type)) {
      query = {
        limit,
        offset,
        options: {
          [type]: {
            pattern: true
          }
        },
        [type]: value,
        provider
      }
    } else {
      query = {
        limit,
        offset,
        provider,
        [type]: value
      }
    }

    getCollections({
      variables: {
        params: query
      }
    })
  }

  // Calls handleCollectionSearch get the next set of collections for pagination
  useEffect(() => {
    if (savedFormData) {
      handleCollectionSearch({ formData: savedFormData })
    }
  }, [offset])

  // Handle the submit button when the user clicks on a collection and associates the collection to draft
  const handleSubmit = (
    collectionConceptId,
    shortName,
    version
  ) => {
    console.log('🚀 ~ CollectionAssociation ~ collectionConceptId:', collectionConceptId)
    console.log('🚀 ~ CollectionAssociation ~ version:', version)
    console.log('🚀 ~ CollectionAssociation ~ shortName:', shortName)

    setSelectedOption({
      collectionConceptId,
      shortName,
      version
    })

    // Let associationDetailDraft = fetchedDraft
    const { nativeId } = fetchedDraft
    const { ummMetadata } = fetchedDraft

    const associationDetailDraft = {
      ...ummMetadata,
      _private: {
        CollectionAssociation: {
          collectionConceptId,
          shortName,
          version
        }
      }
    }
    console.log('🚀 ~ CollectionAssociation ~ associationDetailDraft:', associationDetailDraft)

    ingestDraftMutation({
      variables: {
        conceptType: derivedConceptType,
        metadata: associationDetailDraft,
        nativeId,
        providerId,
        ummVersion: getUmmVersion(derivedConceptType)
      },
      onCompleted: () => {
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

  const handleClear = () => {
    const { ummMetadata } = fetchedDraft
    const { nativeId } = fetchedDraft

    const modifiedMetadata = removeMetadataKeys(ummMetadata, ['_private'])
    setLoading(true)
    ingestDraftMutation({
      variables: {
        conceptType: derivedConceptType,
        metadata: modifiedMetadata,
        nativeId,
        providerId,
        ummVersion: getUmmVersion(derivedConceptType)
      },
      onCompleted: () => {
        setLoading(false)
        setCollectionLoading({})
        // Add a success notification
        addNotification({
          message: `Cleared ${conceptId} Association`,
          variant: 'danger'
        })
      },
      onError: (getIngestError) => {
        console.log('🚀 ~ handleSubmit ~ getIngestError:', getIngestError)
      }
    })
  }

  const handleChange = (event) => {
    const { formData } = event
    setSearchFormData(
      formData
    )
  }

  const { items = [], count } = collectionSearchResult || {}
  const collectionSearchData = (items.map((item) => {
    const {
      conceptId: collectionConceptId,
      provider,
      version,
      shortName
    } = item

    return (
      {
        key: collectionConceptId,
        cells:
        [

          {
            value: (
              collectionConceptId
            )
          },
          {
            value: (
              shortName
            )
          },
          {
            value: (
              version
            )
          },
          {
            value: (
              provider
            )
          },
          {
            value:
            (
              <div className="d-flex">
                <Button
                  className="d-flex"
                  onClick={
                    () => {
                      setSelectedOption({
                        collectionConceptId,
                        shortName,
                        version
                      })

                      handleSubmit(
                        collectionConceptId,
                        shortName,
                        version
                      )
                    }
                  }
                  variant="secondary"
                  size="sm"
                >
                  Create Association
                </Button>
              </div>
            )
          }
        ]
      }
    )
  }))

  if (loading) {
    return (
      <Page>
        <LoadingBanner />
      </Page>
    )
  }

  if (error) {
    const message = parseError(error)

    return (
      <Page>
        <ErrorBanner message={message} />
      </Page>
    )
  }

  return (
    <Page>
      <h3>Collection Association Search</h3>
      <Row className="m-4">
        <h4>Currently Selected Collection</h4>
        <Col sm={12} className="bg-white rounded">
          <BootstrapTable striped>
            <thead>
              <tr>
                <th>Collection</th>
                <th>Short Name</th>
                <th>Version</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{currentSelectedAssociation?.collectionConceptId || 'No Collection Selected'}</td>
                <td>{currentSelectedAssociation?.shortName}</td>
                <td>{currentSelectedAssociation?.version}</td>
              </tr>
            </tbody>
          </BootstrapTable>
          <BootstrapSelect
            className="mb-3 m-2"
            onClick={handleClear}
            variant="outline-danger"
          >
            Clear Collection Association
          </BootstrapSelect>
        </Col>

        <h4 className="mt-5">Currently Selected Collection</h4>
        <Col sm={12} className="bg-white rounded">
          <Form
            className="bg-white m-2 pt-2"
            schema={collectionAssociation}
            validator={validator}
            fields={fields}
            uiSchema={collectionAssociationUiSchema}
            widgets={widgets}
            templates={templates}
            onChange={handleChange}
            formData={searchFormData}
            formContext={
              {
                focusField,
                setFocusField
              }
            }
          >
            <BootstrapSelect type="submit" style={{ marginTop: '-100px' }} onClick={handleCollectionSearch}>
              Search for Collection
            </BootstrapSelect>
          </Form>
        </Col>
        <Col sm={12} className="mt-5 bg-white rounded">
          {
            showSelectCollection
            && (
              <>
                <h5 className="m-2 mt-3">Select Collection</h5>
                <Table
                  headers={['Collection', 'Short Name', 'Version', 'Provider', 'Actions']}
                  classNames={['col-auto', 'col-auto', 'col-auto', 'col-auto', 'col-auto']}
                  loading={collectionLoading}
                  data={collectionSearchData}
                  error={error}
                  noDataError="No Collections Found."
                  count={count}
                  setOffset={setOffset}
                  limit={limit}
                  offset={offset}
                />
                {/* <BootstrapSelect
                  onClick={handleSubmit}
                >
                  Submit
                </BootstrapSelect> */}
              </>
            )
          }
        </Col>
      </Row>
    </Page>
  )
}

export default CollectionAssociation
