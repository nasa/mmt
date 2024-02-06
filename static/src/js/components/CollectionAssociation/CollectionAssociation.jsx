import React, { useEffect, useState } from 'react'
import { Button, Placeholder } from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap/Table'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { useLazyQuery, useMutation } from '@apollo/client'
import Form from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'
import camelcaseKeys from 'camelcase-keys'
import { useNavigate, useParams } from 'react-router'
import pluralize from 'pluralize'
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
  const [savedFormData, setSavedFormData] = useState()
  const [currentSelectedAssociation, setCurrentSelectedAssociation] = useState({})
  const [offset, setOffset] = useState(0)
  const limit = 20

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
      const { ummMetadata } = draft
      const { __private } = ummMetadata
      const { CollectionAssociation: savedAssociation } = __private || {}
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
    setSavedFormData(formData)
    const formattedFormData = camelcaseKeys(formData, { deep: true })

    const { searchField } = formattedFormData
    const type = Object.keys(searchField)
    const value = Object.values(searchField).at(0)

    setLoading(true)
    setShowSelectCollection(true)

    getCollections({
      variables: {
        params: {
          limit,
          offset,
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

  const handleClear = () => {
    console.log('clear')
  }

  // Calls
  useEffect(() => {
    if (savedFormData) {
      handleCollectionSearch({ formData: savedFormData })
    }
  }, [offset])

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
              <input
                id={collectionConceptId}
                type="radio"
                name="select-collection"
                value={collectionConceptId}
                onClick={
                  () => {
                    setSelectedOption({
                      collectionConceptId,
                      shortName,
                      version
                    })
                  }
                }
              />
            )
          },
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
          }
        ]
      }
    )
  }))

  return (
    <Page>
      <h4>Collection Association Search</h4>
      <Row className="m-5">

        <Col sm={12} className="pb-5">
          <h5>Currently Selected Collection</h5>
          <BootstrapTable striped borderless>
            <thead>
              <tr>
                <th>Collection</th>
                <th>Short Name</th>
                <th>Version</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{currentSelectedAssociation?.conceptId || 'No Collection Selected'}</td>
                <td>{currentSelectedAssociation?.shortName}</td>
                <td>{currentSelectedAssociation?.version}</td>
              </tr>
            </tbody>
          </BootstrapTable>
          <Button
            onClick={handleClear}
            variant="outline-danger"
          >
            Clear Collection Association
          </Button>
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
                <Table
                  headers={['', 'Collection', 'Short Name', 'Version', 'Provider']}
                  classNames={['col-sm-1', 'col-md-4', 'col-md-4', 'col-md-4', 'col-md-4']}
                  loading={loading}
                  data={collectionSearchData}
                  error={error}
                  noDataError="No Collections Found."
                  count={count}
                  setOffset={setOffset}
                  limit={limit}
                  offset={offset}
                />
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
