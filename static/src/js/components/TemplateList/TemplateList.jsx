import React, {
  useCallback,
  useEffect,
  useState
} from 'react'
import { Link } from 'react-router-dom'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import moment from 'moment'
import { FaPlus } from 'react-icons/fa'

import deleteTemplate from '../../utils/deleteTemplate'
import errorLogger from '../../utils/errorLogger'
import getTemplates from '../../utils/getTemplates'

import useAppContext from '../../hooks/useAppContext'
import useNotificationsContext from '../../hooks/useNotificationsContext'

import { DATE_FORMAT } from '../../constants/dateFormat'

import Button from '../Button/Button'
import CustomModal from '../CustomModal/CustomModal'
import EllipsisLink from '../EllipsisLink/EllipsisLink'
import ErrorBanner from '../ErrorBanner/ErrorBanner'
import Page from '../Page/Page'
import PageHeader from '../PageHeader/PageHeader'
import Table from '../Table/Table'

/**
 * Renders a TemplateList component
 *
 * @component
 * @example <caption>Render a TemplateList</caption>
 * return (
 *   <TemplateList />
 * )
 */
const TemplateList = () => {
  const { user } = useAppContext()
  const { token } = user

  const [templateList, setTemplateList] = useState([])
  const [errors, setErrors] = useState()
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedDeleteId, setSelectedDeleteId] = useState()

  const { providerId } = user

  const { addNotification } = useNotificationsContext()

  const fetchTemplates = async () => {
    const { response, error } = await getTemplates(providerId, token)
    setErrors(error)
    setTemplateList(response)
    setLoading(false)
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  const toggleShowDeleteModal = (nextState) => {
    setShowDeleteModal(nextState)
  }

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

  const handleDelete = async () => {
    const { response } = await deleteTemplate(providerId, token, selectedDeleteId)
    if (response.ok) {
      toggleShowDeleteModal(false)
      addNotification({
        message: 'Template deleted successfully',
        variant: 'success'
      })

      setLoading(true)

      fetchTemplates()
    } else {
      toggleShowDeleteModal(false)
      addNotification({
        message: 'Error deleting template',
        variant: 'danger'
      })

      errorLogger('Error deleting template', 'TemplateList: deleteTemplate')
    }
  }

  const buildActionsCell = useCallback((cellData, rowData) => {
    const { id } = rowData

    return (
      <Row>
        <Col className="col-auto">
          <Link to={`/templates/collections/${id}/collection-information`}>Edit</Link>
        </Col>
        <Col className="col-auto">
          <Button
            className="mb-1"
            inline
            naked
            type="button"
            variant="link"
            onClick={
              () => {
                toggleShowDeleteModal(true)
                setSelectedDeleteId(id)
              }
            }
          >
            Delete
          </Button>

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
      dataAccessorFn: (cellData) => moment(cellData).format(DATE_FORMAT)
    },
    {
      title: 'Actions',
      className: 'col-auto',
      dataAccessorFn: buildActionsCell
    }
  ]

  const templateListHeader = () => (
    <PageHeader
      breadcrumbs={
        [
          {
            label: 'Templates',
            to: '/templates/collections'
          }
        ]
      }
      pageType="secondary"
      primaryActions={
        [{
          icon: FaPlus,
          iconTitle: 'A plus icon',
          title: 'New Template',
          to: 'new',
          variant: 'primary'
        }]
      }
      title={`${providerId} Template`}
    />
  )

  return (
    <Page
      pageType="secondary"
      header={templateListHeader()}
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
      <CustomModal
        message="Are you sure you want to delete this template?"
        show={showDeleteModal}
        toggleModal={toggleShowDeleteModal}
        actions={
          [
            {
              label: 'No',
              variant: 'secondary',
              onClick: () => { toggleShowDeleteModal(false) }
            },
            {
              label: 'Yes',
              variant: 'primary',
              onClick: handleDelete
            }
          ]
        }
      />
    </Page>
  )
}

export default TemplateList
