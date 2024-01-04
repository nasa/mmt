import React, { useState } from 'react'
import {
  Button,
  Placeholder,
  Table
} from 'react-bootstrap'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Select from 'react-select'
import { useLazyQuery } from '@apollo/client'
import { camelCase, kebabCase } from 'lodash-es'
import Form from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'
import Page from '../Page/Page'
import For from '../For/For'
import useCollectionsQuery from '../../hooks/useCollectionsQuery'
import { GET_COLLECTIONS } from '../../operations/queries/getCollections'
import useAppContext from '../../hooks/useAppContext'
import collectionAssociation from '../../schemas/collectionAssociation'
import OneOfField from '../OneOfField/OneOfField'
import CustomTextWidget from '../CustomTextWidget/CustomTextWidget'
import CustomDateTimeWidget from '../CustomDateTimeWidget/CustomDateTimeWidget'
import CustomSelectWidget from '../CustomSelectWidget/CustomSelectWidget'

const CollectionAssociation = () => {
  const { user, draft } = useAppContext()
  const { providerId } = user
  console.log('🚀 ~ file: CollectionAssociation.jsx:20 ~ CollectionAssociation ~ draft:', draft)

  const [selectedOption, setSelectedOption] = useState()
  const [searchField, setSearchField] = useState()
  const [searchTermValue, setSearchTermValue] = useState(null)
  const [providerFilter, setProviderFilter] = useState(providerId)
  const [collectionSearch, setCollectionSearch] = useState({})
  const [showSelectCollection, setShowSelectCollection] = useState(false)
  const [loading, setLoading] = useState()

  const searchFieldEnums = [
    {
      label: 'Concept ID',
      value: 'Concept ID'
    },
    {
      label: 'Short Name',
      value: 'Short Name'
    },
    {
      label: 'Data Center',
      value: 'Data Center'
    },
    {
      label: 'Platform',
      value: 'Platform'
    },
    {
      label: 'Processing Level ID',
      value: 'Processing Level ID'
    },
    {
      label: 'Project',
      value: 'Project'
    }
  ]

  const [getCollections] = useLazyQuery(GET_COLLECTIONS, {
    onCompleted: (getCollectionsData) => {
      setCollectionSearch(getCollectionsData.collections)
      setLoading(false)
    },
    onError: (getCollectionsError) => {
      setLoading(false)
      console.log('error:', getCollectionsError)
    }
  })

  const handleSelectChange = (event) => {
    const { value } = event

    setSearchField(value)
  }

  const handleInputChange = (event) => {
    const { value } = event.target

    setSearchTermValue(value)
  }

  const handleSearchSubmit = () => {
    console.log('search field', camelCase(searchField))
    setLoading(true)
    setShowSelectCollection(true)
    getCollections({
      variables: {
        params: {
          [camelCase(searchField)]: searchTermValue,
          provider: providerFilter
        }
      }
    })
  }

  const fields = {
    OneOfField
  }

  const widgets = {
    TextWidget: CustomTextWidget,
    DateTimeWidget: CustomDateTimeWidget,
    SelectWidget: CustomSelectWidget
  }
  const { items = [], count } = collectionSearch || {}

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
        />
        {/* Search Field */}
        <Col className="pb-5">

          <div className="pb-4">
            <h5>Search Field</h5>
            <Select
              className="col-md-4"
              placeholder="Collection Data Type"
              styles={{ width: '50px' }}
              options={searchFieldEnums}
              onChange={handleSelectChange}
            />
          </div>

          <div className="pb-4">
            <h5>Search Term</h5>
            <input
              className="col-sm-4 pb-4"
              name="Search Term"
              onChange={handleInputChange}
            />
          </div>

          <div className="pb-4">
            <h5>Filter</h5>
            <input
              type="radio"
              className=""
              name="provider"
              onClick={() => { setProviderFilter(providerId) }}
            />
            <label className="m-2">Search only my collections</label>

            <input
              type="radio"
              className=""
              name="provider"
              onClick={() => { setProviderFilter(null) }}
            />
            <label className="m-2">Search all collections</label>
          </div>

          <div className="pb-5">
            <Button
              onClick={handleSearchSubmit}
            >
              Search for Collection
            </Button>
          </div>
        </Col>

        {/* Select Collection */}
        <Col sm={12}>
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
                                    onClick={() => { setSelectedOption(conceptId) }}
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
                <Button>Submit</Button>
              </>
            )
          }
        </Col>
      </Row>
    </Page>
  )
}

export default CollectionAssociation
