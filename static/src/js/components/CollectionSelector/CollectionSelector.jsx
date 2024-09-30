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
import Placeholder from 'react-bootstrap/Placeholder'
import Popover from 'react-bootstrap/Popover'
import Row from 'react-bootstrap/Row'

import { debounce, isEmpty } from 'lodash-es'

import classNames from 'classnames'

import {
  FaMinus,
  FaPlus,
  FaTrash
} from 'react-icons/fa'

import { useLazyQuery, useSuspenseQuery } from '@apollo/client'

import { GET_PERMISSION_COLLECTIONS } from '@/js/operations/queries/getPermissionCollections'

import useAppContext from '@/js/hooks/useAppContext'
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
  const [searchAvailable, setSearchAvailable] = useState('')
  const [searchSelected, setSearchSelected] = useState('')

  const [highlightedAvailable, setHighlightedAvailable] = useState({})
  const [highlightedSelected, setHighlightedSelected] = useState({})

  const [loading, setLoading] = useState(false)
  const { providerId } = useAppContext()

  const { data: collectionList } = useSuspenseQuery(GET_PERMISSION_COLLECTIONS, {
    variables: {
      params: {
        provider: providerId,
        limit: 100
      }
    }
  })

  const { collections } = collectionList
  const { items } = collections

  // Map through items of collection and creates an object with conceptId as unique keys
  const availableCollections = items?.reduce((obj, item) => ({
    ...obj,
    [item.conceptId]: item
  }), {})

  const [selectedItems, setSelectedItems] = useState({})
  const [availableItems, setAvailableItems] = useState([])

  useEffect(() => {
    setAvailableItems(availableCollections)
  }, [providerId])

  useEffect(() => {
    if (!isEmpty(formData)) {
      setSelectedItems(formData)
    } else {
      setSelectedItems({})
    }
  }, [formData])

  /**
   * Moves items from `highlightedAvailable` to `selectedItems`.
   *
   * This function combines the currently selected items (`selectedItems`)
   * with the items availableItems for selection (`selectedAvailable`).
   */
  const moveToSelected = () => {
    const newSelected = {
      ...selectedItems,
      ...highlightedAvailable
    }

    setSelectedItems(newSelected)
    setHighlightedAvailable({})

    onChange(newSelected)
  }

  /**
   * Moves items from `highlightedSelected` back to `availableItems`.
   *
   * This function removes the currently selected items (`highlightedSelected`)
   * from the `selectedItems` column and adds them back to the `availableItems` column.
   */
  const moveToAvailable = () => {
    const newSelected = { ...selectedItems }

    Object.keys(highlightedSelected).forEach((key) => {
      delete newSelected[key]
    })

    setSelectedItems(newSelected)
    setHighlightedSelected({})
    onChange(newSelected)
  }

  /**
   * Deletes all selected items.
   *
   * This function clears all selectedItems states (`selectedItems`, and `highlightedSelected`)
   */
  const deleteSelectedItems = () => {
    onChange({})
    setSelectedItems({})
    setHighlightedAvailable({})
    setHighlightedSelected({})
  }

  /**
   * Toggles the selection of an item in the availableItems list.
   *
   * This function checks if an item is already selected in the `highlightedAvailable` state.
   * If the item is already selected, it removes the item. If the item is not selected, it adds the item.
   *
   * @param {Object} availableItem - The item to be toggled in the availableItems selection.
   */
  const toggleAvailableSelection = (availableItem) => {
    const { conceptId } = availableItem

    const newSelectedAvailable = { ...highlightedAvailable }

    // Check if the item is already selected and remove it, otherwise add it
    if (newSelectedAvailable[conceptId]) {
      delete newSelectedAvailable[conceptId]
    } else {
      newSelectedAvailable[conceptId] = availableItem
    }

    setHighlightedAvailable(newSelectedAvailable)
  }

  /**
   * Toggles the selection of an item in the selected list.
   *
   * This function checks if an item is already selected in the `highlightedSelected` state.
   * If the item is already selected, it removes the item. If the item is not selected, it adds the item.
   *
   * @param {Object} selectedItem - The item to be toggled in the selected selection.
   */
  const toggleSelectedSelection = (selectedItem) => {
    const { conceptId } = selectedItem

    const newSelectedSelected = {
      ...highlightedSelected,
      [conceptId]: highlightedSelected[conceptId] ? undefined : selectedItem
    }

    setHighlightedSelected(newSelectedSelected)
  }

  /**
   * Filters the selected list
   */
  const filteredSelected = Object.values(selectedItems)?.filter(
    (item) => item.shortName.toLowerCase().includes(searchSelected.toLowerCase())
  )

  const [getCollections] = useLazyQuery(GET_PERMISSION_COLLECTIONS)

  const loadOptions = useCallback(debounce((inputValue, callback) => {
    setLoading(true)
    getCollections({
      variables: {
        params: {
          options: {
            shortName: {
              pattern: true
            }
          },
          provider: providerId,
          shortName: `${inputValue}*`,
          limit: 100
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

        setLoading(false)
        callback(options)
      }
    })
  }, 1000), [])

  const handleAvailableSearchChange = (e) => {
    const { target } = e
    const { value } = target

    setSearchAvailable(value)
    loadOptions(value, setAvailableItems)
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
    <Row className="mb-4">
      <Col>
        <div className="border rounded p-3">
          <h5 className="text-center mb-3">Available Collections</h5>
          <Form.Control
            className="mb-3"
            onChange={handleAvailableSearchChange}
            onKeyDown={(event) => { if (event.key === 'Enter') event.preventDefault() }}
            placeholder="Search Available..."
            type="text"
            value={searchAvailable}
          />
          <div className="collection-selector__list-group  d-block w-100 overflow-y-scroll border rounded">
            <ul className="list-unstyled h-100">
              {
                loading ? (
                  <Placeholder animation="glow">
                    <Placeholder className="border rounded p-3  w-100 mb-2" />
                    <Placeholder className="border rounded p-3  w-100 mb-2" />
                    <Placeholder className="border rounded p-3  w-100 mb-2" />
                    <Placeholder className="border rounded p-3  w-100 mb-2" />
                    <Placeholder className="border rounded p-3  w-100 mb-2" />
                    <Placeholder className="border rounded p-3  w-100 mb-2" />
                    <Placeholder className="border rounded p-3  w-100 mb-2" />
                    <Placeholder className="border rounded p-3  w-100 mb-2" />
                    <Placeholder className="border rounded p-3  w-100 mb-2" />
                    <Placeholder className="border rounded p-3  w-100 mb-2" />
                    <Placeholder className="border rounded p-3  w-100 mb-2" />
                    <Placeholder className="border rounded p-3  w-100 mb-2" />
                    <Placeholder className="border rounded p-3  w-100 mb-2" />
                  </Placeholder>
                )
                  : (
                    <For each={Object.values(availableItems)}>
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
                                  classNames(
                                    'collection-selector__list-group-item d-flex justify-content-between align-items-center px-3 py-2',
                                    {
                                      'collection-selector__list-group-item--selected': selectedItems[conceptId],
                                      'collection-selector__list-group-item--available': highlightedAvailable[conceptId]
                                    }
                                  )
                                }
                                key={conceptId}
                                onClick={() => toggleAvailableSelection(item)}
                              >
                                <div>
                                  {
                                    directDistributionInformation ? (
                                      <span>
                                        {title}
                                        <i className="fa fa-cloud m-1 text-secondary" />
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
                  )
              }

            </ul>
          </div>

          <div className="text-muted mt-2">
            Showing
            {' '}
            {Object.values(availableItems).length}
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
          title="Add selected"
          variant="primary"
        />
        <Button
          className="mb-2"
          Icon={FaMinus}
          iconOnly
          iconTitle="minus icon"
          onClick={moveToAvailable}
          title="Remove selected"
          variant="primary"
        />
        <Button
          Icon={FaTrash}
          iconOnly
          iconTitle="trash icon"
          onClick={deleteSelectedItems}
          title="Remove all"
          variant="danger"
        />
      </Col>
      <Col>
        <div className="border rounded p-3 h-100">
          <h5 className="text-center mb-3">Selected Collections</h5>
          <Form.Control
            className="mb-3"
            onChange={(e) => setSearchSelected(e.target.value)}
            onKeyDown={(event) => { if (event.key === 'Enter') event.preventDefault() }}
            placeholder="Search Selected..."
            type="text"
            value={searchSelected}
          />
          <div className="collection-selector__list-group d-block w-100 overflow-y-scroll border rounded">

            <ul className="list-unstyled">
              <For each={Object.values(filteredSelected)}>
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
                            classNames(
                              'collection-selector__list-group-item d-flex justify-content-between align-items-center px-3 py-2',
                              {
                                'collection-selector__list-group-item--available': !!highlightedSelected[conceptId]
                              }
                            )
                          }
                          key={conceptId}
                          onClick={() => toggleSelectedSelection(item)}
                        >
                          <div>
                            {
                              directDistributionInformation ? (
                                <span>
                                  {title}
                                  <i className="fa fa-cloud m-1 text-secondary" />
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
  formData: {}
}

CollectionSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.shape({})
}

export default CollectionSelector
