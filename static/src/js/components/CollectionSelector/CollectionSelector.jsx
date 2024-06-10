import React, {
  useCallback,
  useEffect,
  useState
} from 'react'

import PropTypes from 'prop-types'

import Badge from 'react-bootstrap/Badge'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Row from 'react-bootstrap/Row'

import {
  FaMinus,
  FaPlus,
  FaTrash
} from 'react-icons/fa'

import { useLazyQuery, useSuspenseQuery } from '@apollo/client'

import { GET_PERMISSION_COLLECTIONS } from '@/js/operations/queries/getPermissionCollections'

import { debounce, isEmpty } from 'lodash-es'

import Button from '../Button/Button'
import For from '../For/For'

import './CollectionSelector.scss'

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
const CollectionSelector = ({ onChange, formData }) => {
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
    const newSelectedCollections = selectedAvailable.filter(
      (availableItem) => !selected.some(
        (selectedItem) => selectedItem.conceptId === availableItem.conceptId
      )
    )

    const updatedSelectedCollections = [...selected, ...newSelectedCollections]
    setSelected(updatedSelectedCollections)
    setSelectedAvailable([])
    onChange(updatedSelectedCollections)
  }

  const moveToAvailable = () => {
    setSelected(selected.filter(
      (selectedItem) => !selectedSelected.some(
        (selectedSelectedItem) => selectedSelectedItem.conceptId === selectedItem.conceptId
      )
    ))

    setSelectedSelected([])
  }

  const deleteSelectedItems = () => {
    onChange([])
    setSelected([])
    setSelectedAvailable([])
    setSelectedSelected([])
  }

  const toggleAvailableSelection = (availableItem) => {
    setSelectedAvailable(selectedAvailable.some(
      (selectedAvailableItem) => selectedAvailableItem.conceptId === availableItem.conceptId
    )
      ? selectedAvailable.filter(
        (selectedAvailableItem) => selectedAvailableItem.conceptId !== availableItem.conceptId
      )
      : [...selectedAvailable, availableItem])
  }

  const toggleSelectedSelection = (selectedItem) => {
    setSelectedSelected(selectedSelected.some(
      (selectedSelectedItem) => selectedSelectedItem.conceptId === selectedItem.conceptId
    )
      ? selectedSelected.filter(
        (selectedSelectedItem) => selectedSelectedItem.conceptId !== selectedItem.conceptId
      )
      : [...selectedSelected, selectedItem])
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

  return (
    <Row className="m-2">
      <Col>
        <div className="border rounded p-3">
          <h5 className="text-center">Available Collections</h5>
          <Form.Control
            className="mb-3"
            onChange={handleAvailableSearchChange}
            placeholder="Search Available..."
            type="text"
            value={searchAvailable}
          />
          <div className="collection-selector__list-group border rounded p-3">
            <ul className="list-unstyled h-100">
              <For each={available}>
                {
                  (
                    item
                  ) => {
                    const {
                      conceptId,
                      directDistributionInformation,
                      entryTitle,
                      provider,
                      shortName
                    } = item

                    const title = `${shortName} | ${entryTitle}`

                    return (
                      <OverlayTrigger
                        key={conceptId}
                        overlay={popover(item)}
                        placement="top"
                      >
                        <li
                          aria-hidden="true"
                          aria-label={title}
                          className={
                            `collection-selector__list-group-item d-flex justify-content-between align-items-center
                          ${selected.some((s) => s.conceptId === conceptId) ? 'collection-selector__list-group-item-secondary' : ''}
                          ${selectedAvailable.some((i) => i.conceptId === conceptId) ? 'collection-selector__list-group-item-primary' : ''}`
                          }
                          key={conceptId}
                          onClick={() => toggleAvailableSelection(item)}
                        >
                          <div>
                            {
                              directDistributionInformation ? (
                                <span>
                                  {title}
                                  <i className="fa fa-cloud m-1" />
                                </span>
                              ) : title
                            }
                            <Badge
                              className="m-1"
                              pill
                              bg="secondary"
                            >
                              {provider}
                            </Badge>
                          </div>
                        </li>
                      </OverlayTrigger>
                    )
                  }
                }
              </For>
            </ul>
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
          iconTitle="plus icon"
          onClick={moveToSelected}
          variant="primary"
        />
        <Button
          className="mb-2"
          Icon={FaMinus}
          iconOnly
          iconTitle="minus icon"
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
      <Col>
        <div className="border rounded p-3 h-100">
          <h5 className="text-center">Selected Collections</h5>
          <Form.Control
            type="text"
            placeholder="Search Selected..."
            value={searchSelected}
            onChange={(e) => setSearchSelected(e.target.value)}
            className="mb-3"
          />
          <div className="collection-selector__list-group border rounded p-3">

            <ul className="list-unstyled">
              <For each={filteredSelected}>
                {
                  (item) => {
                    const {
                      conceptId,
                      directDistributionInformation,
                      entryTitle,
                      provider,
                      shortName
                    } = item

                    const title = `${shortName} | ${entryTitle}`

                    return (
                      <OverlayTrigger
                        key={item.conceptId}
                        overlay={popover(item)}
                        placement="top"
                      >

                        <li
                          aria-hidden="true"
                          aria-label={`Selected ${title}`}
                          className={
                            `collection-selector__list-group-item d-flex justify-content-between align-items-center 
                        ${selectedSelected.some((i) => i.conceptId === item.conceptId) ? 'collection-selector__list-group-item-primary' : ''}`
                          }
                          key={conceptId}
                          onClick={() => toggleSelectedSelection(item)}
                        >
                          <div>
                            {
                              directDistributionInformation ? (
                                <span>
                                  {title}
                                  <i className="fa fa-cloud m-1" />
                                </span>
                              ) : title
                            }
                            <Badge
                              className="m-1"
                              pill
                              bg="secondary"
                            >
                              {provider}
                            </Badge>
                          </div>
                        </li>
                      </OverlayTrigger>
                    )
                  }
                }
              </For>
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

CollectionSelector.defaultProps = {
  formData: []
}

CollectionSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.arrayOf(PropTypes.shape({}))
}

export default CollectionSelector
