import React, {
  useCallback,
  useEffect,
  useState
} from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Col, Row } from 'react-bootstrap'
import pluralize from 'pluralize'
import Page from '../Page/Page'
import useAppContext from '../../hooks/useAppContext'
import getTemplates from '../../utils/getTemplates'
import Table from '../Table/Table'
import EllipsisLink from '../EllipsisLink/EllipsisLink'
import ErrorBanner from '../ErrorBanner/ErrorBanner'

const TemplateList = ({ templateType }) => {
  const { user } = useAppContext()

  const [templateList, setTemplateList] = useState([])
  const [errors, setErrors] = useState()
  const [loading, setLoading] = useState(true)

  const { providerId } = user

  useEffect(() => {
    const fetchTemplates = async () => {
      const { response, error } = await getTemplates(providerId)

      setErrors(error)
      setTemplateList(response)
      setLoading(false)
    }

    fetchTemplates()
  }, [])

  const buildEllipsisLinkCell = useCallback((cellData, rowData) => {
    const { id } = rowData

    return (
      <EllipsisLink to={`/templates/${pluralize(templateType).toLowerCase()}/${id}`}>
        {cellData}
      </EllipsisLink>
    )
  }, [])

  const buildActionsCell = useCallback((cellData, rowData) => {
    const { id } = rowData

    return (
      <Row>
        <Col className="col-auto">
          <Link to={`/templates/${pluralize(templateType).toLowerCase()}/${id}/collection-information`}>Edit</Link>
        </Col>
        <Col className="col-auto">
          {/* TODO: MMT-3548: As a user, I can delete a collection template */}
          <Link className="" to="/templates">Delete</Link>
        </Col>
      </Row>
    )
  }, [])

  const columns = [
    {
      dataKey: 'name',
      title: 'Title',
      className: 'col-auto',
      dataAccessorFn: buildEllipsisLinkCell
    },
    {
      dataKey: 'lastModified',
      title: 'Last Modified',
      className: 'col-auto',
      dataAccessorFn: (cellData) => cellData.split('T')[0]
    },
    {
      title: 'Actions',
      className: 'col-auto',
      dataAccessorFn: buildActionsCell
    }
  ]

  return (
    <Page
      title={`${providerId} ${templateType} Templates`}
      pageType="secondary"
      breadcrumbs={
        [
          {
            label: `${templateType} Template`,
            to: `/templates/${templateType}s`,
            active: true
          }
        ]
      }
      headerActions={
        [
          {
            label: `New ${templateType} Template`,
            to: 'new'
          }
        ]
      }
    >
      <Row>
        <Col sm={12}>
          {errors && <ErrorBanner message={errors} />}
          {
            !errors && (
              <>
                <div className="mb-3">
                  <span className="text-secondary fw-bolder">
                    Showing
                    {' '}
                    {templateList.length}
                    {' '}
                    collection templates
                  </span>
                </div>
                <Table
                  id="templates-table"
                  columns={columns}
                  loading={loading}
                  data={templateList}
                  noDataMessage="No Collections Templates Found."
                  generateCellKey={({ id }, dataKey) => `column_${dataKey}_${id}`}
                  generateRowKey={({ id }) => `row_${id}`}
                  limit={20}
                />
              </>
            )
          }
        </Col>
      </Row>
    </Page>
  )
}

TemplateList.propTypes = {
  templateType: PropTypes.string.isRequired
}

export default TemplateList
