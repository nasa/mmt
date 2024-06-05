import React, {
  Suspense,
  useCallback,
  useEffect,
  useState
} from 'react'

import PropTypes from 'prop-types'

import Badge from 'react-bootstrap/Badge'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Placeholder from 'react-bootstrap/Placeholder'
import Popover from 'react-bootstrap/Popover'
import Row from 'react-bootstrap/Row'

import {
  FaMinus,
  FaPlus,
  FaTrash
} from 'react-icons/fa'

import { useLazyQuery, useSuspenseQuery } from '@apollo/client'

import { GET_PERMISSION_COLLECTIONS } from '@/js/operations/queries/getPermissionCollections'

import './CollectionSelector.scss'
import { debounce, isEmpty } from 'lodash-es'

import Button from '../Button/Button'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

/*
 * Renders a `CollectionSelectorPlaceholder` component.
 *
 * This component renders the collection selector form page placeholder
 *
 * @param {CollectionSelectorPlaceholder} props
 *
 * @component
 * @example <caption>Render the collection selector form page placeholder</caption>
 * return (
 *   <CollectionSelectorPlaceholder />
 * )
 */
const CollectionSelectorPlaceholder = () => (
  <Row>
    <Col className="p-3">
      <div className="border rounded p-3">
        <Placeholder animation="glow" aria-hidden="true">
          <div className="border rounded p-3 h-100">
            <Placeholder className="d-flex align-items-center w-100 mb-4 " size="sm" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
          </div>
        </Placeholder>
      </div>
    </Col>
    <Col xs="auto" className="d-flex flex-column justify-content-center align-items-center">
      <Placeholder.Button
        className="btn-primary mb-3"
      />
      <Placeholder.Button
        className="btn-primary mb-3"
      />
      <Placeholder.Button
        className="btn-danger"
      />
    </Col>
    <Col className="p-3">
      <div className="border rounded p-3">
        <Placeholder animation="glow" aria-hidden="true">
          <div className="border rounded p-3 h-100">
            <Placeholder className="d-flex align-items-center w-100 mb-4 " size="sm" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
          </div>
        </Placeholder>
      </div>
    </Col>
  </Row>
)

/**
 * @typedef {Object} CollectionSelectorProps
 * @property {Function} onChange A callback function triggered when the user selects collections.
 * @property {Object} formData An Object with the saved metadata
 */
/**
 * Renders a CollectionSelector component
 *
 * @component
 * @example <caption>Render a CollectionSelector</caption>
 * return (
 *   <CollectionSelector />
 * )
 */
const CollectionSelector = ({
  onChange,
  formData
}) => (
  <ErrorBoundary>
    <Suspense fallback={<CollectionSelectorPlaceholder />}>
      <CollectionSelectorComponent onChange={onChange} formData={formData} />
    </Suspense>
  </ErrorBoundary>
)

CollectionSelector.defaultProps = {
  formData: []
}

CollectionSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.arrayOf(PropTypes.shape({}))

}

/**
 * @typedef {Object} CollectionSelectorComponentProps
 * @property {Function} onChange A callback function triggered when the user selects collections.
 * @property {Object} formData An Object with the saved metadata
 */
/**
 * Renders a CollectionSelectorComponent component
 *
 * @component
 * @example <caption>Render a CollectionSelectorComponent</caption>
 * return (
 *   <CollectionSelectorComponent />
 * )
 */
const CollectionSelectorComponent = ({ onChange, formData }) => {
  const [selected, setSelected] = useState([])
  const [searchAvailable, setSearchAvailable] = useState('')
  const [searchSelected, setSearchSelected] = useState('')

  const [selectedAvailable, setSelectedAvailable] = useState([])
  const [selectedSelected, setSelectedSelected] = useState([])

  const { data: collectionList } = useSuspenseQuery(GET_PERMISSION_COLLECTIONS)

  const { collections } = collectionList
  const { items } = collections

  const [available, setAvailable] = useState(items)

  useEffect(() => {
    if (!isEmpty(formData)) {
      setSelected(formData)
    }
  }, [formData])

  const moveToSelected = () => {
    const newSelected = selectedAvailable.filter(
      (item) => !selected.some((s) => s.conceptId === item.conceptId)
    )

    setSelected([...selected, ...newSelected])
    setSelectedAvailable([])
    onChange([...selected, ...newSelected])
  }

  const moveToAvailable = () => {
    setSelected(selected.filter(
      (item) => !selectedSelected.some((s) => s.conceptId === item.conceptId)
    ))

    setSelectedSelected([])
  }

  const deleteSelectedItems = () => {
    onChange([])
    setSelected([])
    setSelectedAvailable([])
    setSelectedSelected([])
  }

  const toggleAvailableSelection = (item) => {
    setSelectedAvailable([...selectedAvailable, item])
  }

  const toggleSelectedSelection = (item) => {
    setSelectedSelected([...selectedSelected, item])
  }

  const filteredSelected = selected.filter(
    (item) => item.shortName.toLowerCase().includes(searchSelected.toLowerCase())
  )

  const [getCollections] = useLazyQuery(GET_PERMISSION_COLLECTIONS)

  const loadOptions = useCallback(debounce((inputValue, callback) => {
    if (inputValue.length >= 3) {
      getCollections({
        variables: {
          params: {
            keyword: inputValue,
            limit: 20
          }
        },
        onCompleted: (data) => {
          const { collections: collectionsSearch } = data

          const options = collectionsSearch.items.map((item) => {
            const {
              conceptId,
              shortName,
              provider,
              directDistributionInformation,
              entryTitle
            } = item

            return {
              conceptId,
              entryTitle,
              shortName,
              provider,
              directDistributionInformation
            }
          })

          callback(options)
        }
      })
    }
  }, 1000), [])

  const handleAvailableSearchChange = (e) => {
    const inputValue = e.target.value
    setSearchAvailable(inputValue)
    loadOptions(inputValue, setAvailable)
  }

  const popover = (item) => {
    const {
      directDistributionInformation,
      entryTitle,
      shortName
    } = item
    const { s3BucketAndObjectPrefixNames } = directDistributionInformation || {}

    return (
      <Popover>
        <Popover.Body>
          {shortName}
          {' '}
          |
          {' '}
          {entryTitle}
          {
            directDistributionInformation && (
              <span>
                {
                  s3BucketAndObjectPrefixNames?.map(
                    (prefix) => (
                      <div
                        key={prefix}
                      >
                        <strong>S3 Prefix: </strong>
                        {' '}
                        {prefix}
                      </div>
                    )
                  )
                }
              </span>
            )
          }
        </Popover.Body>
      </Popover>
    )
  }

  const displayItem = (item) => {
    const {
      provider,
      directDistributionInformation,
      entryTitle,
      shortName
    } = item

    return (
      <div>
        {
          directDistributionInformation ? (
            <span>
              {shortName}
              {' '}
              |
              {' '}
              {entryTitle}
              <i className="fa fa-cloud m-1" />
            </span>
          ) : `${shortName} | ${entryTitle}`
        }
        <Badge
          className="m-1"
          pill
          bg="secondary"
        >
          {provider}
        </Badge>
      </div>
    )
  }

  return (
    <Row className="collection-selector__list-box">
      <Col className="p-3">
        <div className="border rounded p-3">
          <h3 className="text-center">Available Collections</h3>
          <Form.Control
            className="mb-3"
            onChange={handleAvailableSearchChange}
            placeholder="Search Available..."
            type="text"
            value={searchAvailable}
          />
          <div className="collection-selector__list-group border rounded p-3">
            <ul className="list-unstyled h-100">
              {
                available.map((item) => {
                  const {
                    conceptId
                  } = item

                  return (
                    <OverlayTrigger
                      key={conceptId}
                      overlay={popover(item)}
                      placement="top"
                    >
                      <li
                        aria-hidden="true"
                        className={
                          `collection-selector__list-group-item d-flex justify-content-between align-items-center 
                          ${selected.some((s) => s.conceptId === item.conceptId) ? 'collection-selector__list-group-item-secondary' : ''} 
                          ${selectedAvailable.some((i) => i.conceptId === item.conceptId) ? 'collection-selector__list-group-item-primary' : ''}`
                        }
                        key={conceptId}
                        onClick={() => toggleAvailableSelection(item)}
                      >
                        {displayItem(item)}
                      </li>
                    </OverlayTrigger>
                  )
                })
              }
            </ul>
            {/* )
            } */}
          </div>

          <div className="text-muted mt-2">
            Showing
            {' '}
            {available.length}
            {' '}
            items
          </div>
        </div>
      </Col>
      <Col xs="auto" className="d-flex flex-column justify-content-center align-items-center">
        <Button
          className="mb-2"
          Icon={FaPlus}
          iconOnly
          iconTitle="+ icon"
          onClick={moveToSelected}
          variant="primary"
        />
        <Button
          className="mb-2"
          Icon={FaMinus}
          iconOnly
          iconTitle="- icon"
          onClick={moveToAvailable}
          variant="primary"
        />
        <Button
          Icon={FaTrash}
          iconOnly
          iconTitle="trash icon"
          onClick={deleteSelectedItems}
          variant="danger"
        />
      </Col>
      <Col className="p-3">
        <div className="border rounded p-3 h-100">
          <h3 className="text-center">Selected Collections</h3>
          <Form.Control
            type="text"
            placeholder="Search Selected..."
            value={searchSelected}
            onChange={(e) => setSearchSelected(e.target.value)}
            className="mb-3"
          />
          <div className="collection-selector__list-group border rounded p-3">

            <ul className="list-unstyled">
              {
                filteredSelected.map((item) => {
                  const {
                    conceptId
                  } = item

                  return (
                    <OverlayTrigger
                      key={item.conceptId}
                      overlay={popover(item)}
                      placement="top"
                    >

                      <li
                        aria-hidden="true"
                        className={
                          `collection-selector__list-group-item d-flex justify-content-between align-items-center 
                        ${selectedSelected.some((i) => i.conceptId === item.conceptId) ? 'collection-selector__list-group-item-primary' : ''}`
                        }
                        key={conceptId}
                        onClick={() => toggleSelectedSelection(item)}
                      >
                        {displayItem(item)}
                      </li>
                    </OverlayTrigger>

                  )
                })
              }
            </ul>
          </div>
          <div className="text-muted mt-2">
            Showing
            {' '}
            selected
            {' '}
            {filteredSelected.length}
            {' '}
            items
          </div>
        </div>
      </Col>
    </Row>

  )
}

CollectionSelectorComponent.defaultProps = {
  formData: []
}

CollectionSelectorComponent.propTypes = {
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.arrayOf(PropTypes.shape({}))
}

export default CollectionSelector
