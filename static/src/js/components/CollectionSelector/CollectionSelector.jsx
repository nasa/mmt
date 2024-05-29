import React, { Suspense, useState } from 'react'

import Badge from 'react-bootstrap/Badge'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Row from 'react-bootstrap/Row'
import Placeholder from 'react-bootstrap/Placeholder'

import {
  FaMinus,
  FaPlus,
  FaTrash
} from 'react-icons/fa'

import { useSuspenseQuery } from '@apollo/client'

import { GET_PERMISSION_COLLECTIONS } from '@/js/operations/queries/getPermissionCollections'

import Button from '../Button/Button'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

import './CollectionSelector.scss'

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
const CollectionSelector = ({
  onChange,
  formData = {}
}) => (
  <ErrorBoundary>
    <Suspense fallback={<CollectionSelectorPlaceholder />}>
      <CollectionSelectorComponent onChange={onChange} formData={formData} />
    </Suspense>
  </ErrorBoundary>
)

const CollectionSelectorComponent = ({ onChange, formData }) => {
  console.log('🚀 ~ CollectionSelectorComponent ~ formData:', formData)
  const [selected, setSelected] = useState([])

  const [searchAvailable, setSearchAvailable] = useState('')
  const [searchSelected, setSearchSelected] = useState('')

  const [selectedAvailable, setSelectedAvailable] = useState([])
  const [selectedSelected, setSelectedSelected] = useState([])

  const { data } = useSuspenseQuery(
    GET_PERMISSION_COLLECTIONS,
    {
      variables: {
        params: {
          limit: 1000
        }
      }
    }
  )

  const { collections } = data
  const { items } = collections

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
    if (!selected.some((s) => s.conceptId === item.conceptId)) {
      setSelectedAvailable(selectedAvailable.some((i) => i.conceptId === item.conceptId)
        ? selectedAvailable.filter((i) => i.conceptId !== item.conceptId)
        : [...selectedAvailable, item])
    }
  }

  const toggleSelectedSelection = (item) => {
    setSelectedSelected(selectedSelected.some((i) => i.conceptId === item.conceptId)
      ? selectedSelected.filter((i) => i.conceptId !== item.conceptId)
      : [...selectedSelected, item])
  }

  const filteredAvailable = items.filter(
    (item) => item.shortName.toLowerCase().includes(searchAvailable.toLowerCase())
  )

  const filteredSelected = selected.filter(
    (item) => item.shortName.toLowerCase().includes(searchSelected.toLowerCase())
  )

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
            onChange={(e) => setSearchAvailable(e.target.value)}
            placeholder="Search Available..."
            type="text"
            value={searchAvailable}
          />
          <div className="border rounded p-3 collection-selector__scrollable-list">
            <ul className="list-unstyled">
              {
                filteredAvailable.map((item) => {
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
          </div>
          <div className="text-muted mt-2">
            Showing
            {' '}
            {filteredAvailable.length}
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
          <div className="border rounded p-3 scrollable-list">

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
            {filteredSelected.length}
            {' '}
            items
          </div>
        </div>
      </Col>
    </Row>
  )
}

export default CollectionSelector
