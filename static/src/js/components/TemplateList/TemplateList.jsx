import React, {
  useCallback,
  useEffect,
  useState
} from 'react'
import { Link } from 'react-router-dom'
import { Col, Row } from 'react-bootstrap'
import Page from '../Page/Page'
import useAppContext from '../../hooks/useAppContext'
import getTemplates from '../../utils/getTemplates'
import Table from '../Table/Table'
import EllipsisLink from '../EllipsisLink/EllipsisLink'
import ErrorBanner from '../ErrorBanner/ErrorBanner'

const TemplateList = () => {
  const { user } = useAppContext()
  const { token } = user

  const [templateList, setTemplateList] = useState([])
  const [errors, setErrors] = useState()
  const [loading, setLoading] = useState(true)

  const { providerId } = user

  useEffect(() => {
    const fetchTemplates = async () => {
      const { response, error } = await getTemplates(providerId, token)

      setErrors(error)
      setTemplateList(response)
      setLoading(false)
    }

    fetchTemplates()
  }, [])

  const buildEllipsisLinkCell = useCallback((originalCellData, rowData) => {
    const { id } = rowData
    let cellData = originalCellData

    if (!cellData) cellData = '<Blank Name>'

    return (
      <EllipsisLink to={`/templates/collections/${id}`}>
        {cellData}
      </EllipsisLink>
    )
  }, [])

  const buildActionsCell = useCallback((cellData, rowData) => {
    const { id } = rowData

    return (
      <Row>
        <Col className="col-auto">
          <Link to={`/templates/collections/${id}/collection-information`}>Edit</Link>
        </Col>
        <Col className="col-auto">
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
      title={`${providerId} Collection Templates`}
      pageType="secondary"
      breadcrumbs={
        [
          {
            label: 'Collection Template',
            active: true
          }
        ]
      }
      headerActions={
        [
          {
            label: 'New Collection Template',
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
                  noDataMessage="No collection templates found."
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

export default TemplateList
