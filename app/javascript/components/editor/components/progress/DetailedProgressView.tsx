/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-param-reassign */
import {
  Alert,
  Button,
  Col, Container, Modal, Row
} from 'react-bootstrap'
import React from 'react'
import { observer } from 'mobx-react'
import _, { uniqueId } from 'lodash'
import validator from '@rjsf/validator-ajv8'
import { RJSFValidationError } from '@rjsf/utils'
import MetadataEditor from '../../MetadataEditor'
import withRouter from '../withRouter'
import ProgressSection from './ProgressSection'
import { FieldInfo } from './FieldInfo'
import { ProgressCircleType } from './ProgressCircleType'
import { createPath, prefixProperty, removeEmpty } from '../../utils/json_utils'
import ReactJsonSchemaForm from '../ReactJsonSchemaForm'
import './DetailedProgressView.css'
import Status from '../../model/Status'

type DetailedProgressViewProps = {
  router: RouterType
  editor: MetadataEditor
}
type DetailedProgressViewState = {
  status: string,
  loading: boolean,
  showModal: boolean
}

class DetailedProgressView extends React.Component<DetailedProgressViewProps, DetailedProgressViewState> {
  constructor(props: DetailedProgressViewProps) {
    super(props)
    this.state = { status: null, loading: false, showModal: false }
  }
  componentDidMount() {
    const { router, editor } = this.props
    const { params } = router
    const { service } = editor
    const { id } = params

    this.setState({ status: null }, () => {
      editor.fetchDraft(Number(id)).then((draft) => {
        editor.draft = draft
        editor.loading = false
      }).catch((error) => {
        editor.loading = false
        this.setState({ status: `Error retrieving draft! ${error.message}` })
      })
    })

    window.metadataPreview(id, this.conceptType(), service.token, document.getElementById('metadata-preview'))
  }

  conceptType() {
    const { editor } = this.props
    let conceptType = ''
    if (editor.service.draftType === 'tool_drafts') {
      conceptType = 'toolDraft'
    } else if (editor.service.draftType === 'variable_drafts') {
      conceptType = 'variableDraft'
    }
    return conceptType
  }

  isRequired(name: string) {
    const { editor } = this.props
    const { fullSchema: schema } = editor
    return (
      Array.isArray(schema.required) && schema.required.indexOf(name) !== -1
    )
  }

  sectionCircleType(section: FormSection): ProgressCircleType {
    const { editor } = this.props
    const { fullErrors } = editor

    const hasError = fullErrors.some((error: FormError) => {
      const { property } = error
      return section.properties.some((propertyPrefix) => {
        if (prefixProperty(property).startsWith(`${prefixProperty(propertyPrefix)}`)) {
          return true
        }
        return false
      })
    })
    if (hasError) {
      return ProgressCircleType.Error
    }
    return ProgressCircleType.Pass
  }

  fieldsForSection(section: FormSection, draft: unknown): Array<FieldInfo> {
    const fields: Array<FieldInfo> = []

    const {
      editor
    } = this.props

    const {
      fullErrors
    } = editor

    section.properties.forEach((propertyPrefix) => {
      const fieldValue = draft[propertyPrefix]
      const isRequired = this.isRequired(propertyPrefix)
      if (Array.isArray(fieldValue)) {
        this.addFields(fieldValue, section, propertyPrefix, isRequired, fields, fullErrors)
      } else {
        this.addField(fieldValue, section, propertyPrefix, isRequired, fields, fullErrors)
      }
    })
    return fields
  }

  private addField(fieldValue: object, section: FormSection, propertyPrefix: string, isRequired: boolean, fields: FieldInfo[], fullErrors: FormError[]) {
    const errorList = fullErrors.filter((error: FormError) => {
      const { property } = error
      return prefixProperty(property).startsWith(prefixProperty(propertyPrefix))
    })
    if (errorList.length > 0) {
      const fieldInfo = new FieldInfo(section.displayName, propertyPrefix, null, fieldValue ? ProgressCircleType.Error : ProgressCircleType.NotStarted, isRequired, fullErrors[0])
      fields.push(fieldInfo)
    } else {
      const fieldInfo = new FieldInfo(section.displayName, propertyPrefix, null, fieldValue ? ProgressCircleType.Pass : ProgressCircleType.NotStarted, isRequired, null)
      fields.push(fieldInfo)
    }
  }

  private addFields(fieldValues: object[], section: FormSection, propertyPrefix: string, isRequired: boolean, fields: FieldInfo[], fullErrors: FormError[]) {
    fieldValues.forEach((name, index) => {
      const fieldInfo = new FieldInfo(section.displayName, propertyPrefix, index, ProgressCircleType.Pass, isRequired, null)
      fields.push(fieldInfo)
    })
    const hasError = fullErrors.some((error: FormError) => {
      const { property } = error
      return prefixProperty(property).startsWith(prefixProperty(propertyPrefix))
    })
    if (hasError) { // determine which one in the array has the error
      fullErrors.forEach((error: FormError) => {
        const { property } = error
        if (prefixProperty(property).startsWith(prefixProperty(propertyPrefix))) {
          const path = createPath(property)
          const regexp = /^[^[]+\[(\d+)\].*/
          const match = path.match(regexp)
          if (match) {
            const index = Number(match[1])
            fields[index].status = ProgressCircleType.Error
            fields[index].error = error
          }
        }
      })
    }
  }

  deleteDraft() {
    const { editor, router } = this.props
    const { navigate } = router
    const { draft } = editor
    this.setState({ loading: true }, () => {
      editor.deleteDraft(draft).then((draft) => {
        editor.draft = draft
        editor.status = new Status('success', 'Draft Deleted')
        navigate(`/${editor.documentType}/deleteDraftView`, { replace: false })
      }).catch(() => {
        editor.status = new Status('warning', 'error deleting draft!')
      })
    })
  }

  publishDraft() {
    const { editor } = this.props
    const { draft } = editor
    const { model } = editor
    this.setState({ loading: true }, () => {
      editor.publishDraft(draft).then((draft) => {
        const urlOrigin = window.location.origin
        editor.draft = draft
        editor.status = new Status('success', `Draft Published ${draft.conceptId}/${draft.revisionId}`)
        editor.publishErrors = null
        if (model.shouldRedirectAfterPublish) {
          window.location.href = `${urlOrigin}//${editor.documentType.split('_').at(0)}s/${draft.conceptId}`
        }
        this.setState({ loading: false })
      }).catch((errors) => {
        editor.publishErrors = errors
        editor.status = new Status('warning', 'error publishing draft!')
        this.setState({ loading: false })
      })
    })
  }

  renderDeleteModal() {
    return (
      <Modal id="delete-modal" show>
        <Modal.Body>
          Are you sure you want to delete this Draft?
        </Modal.Body>
        <Modal.Footer>
          <Button data-testid="delete-modal-no-button" variant="secondary" onClickCapture={() => { this.setState({ showModal: false }) }}>No</Button>
          <Button data-testid="delete-modal-yes-button" variant="primary" onClickCapture={() => { this.deleteDraft() }}>Yes</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  render() {
    const {
      editor
    } = this.props

    const {
      formSections, fullSchema
    } = editor

    let {
      fullData: draftJson
    } = editor

    draftJson = removeEmpty(draftJson)

    const {
      status, loading, showModal
    } = this.state

    const sectionList = formSections.map((section: FormSection) => {
      const sectionLabel = section.displayName
      const status = this.sectionCircleType(section)
      const fields = this.fieldsForSection(section, draftJson)
      return (
        <div
          className="progress-section"
          key={JSON.stringify(section)}
          data-testid={`detailed-progress-view--progress-section__${_.kebabCase(sectionLabel)}_${_.kebabCase(status)}`}
        >
          <ProgressSection
            section={sectionLabel}
            status={status}
            fields={fields}
            editor={editor}
          />
        </div>
      )
    })
    while ((sectionList.length % 3) !== 0) {
      sectionList.push(<div className="progress-section" key={`${uniqueId('empty-section')}`} />)
    }

    return (
      <div id="react-editor-form-containter">
        <Container id="metadata-form">
          <Row>
            <Col sm={12}>
              {editor.status && (
                <Alert key={editor.status.type} variant={editor.status.type} onClose={() => { editor.status = null }} dismissible>
                  {editor.status.message}
                </Alert>
              )}
              {editor.publishErrors && editor.publishErrors.length > 0 && (
                <Alert key={JSON.stringify(editor.status.message)} variant="warning" onClose={() => { editor.publishErrors = null }} dismissible>
                  <h5>Error Publishing Draft</h5>
                  {editor.publishErrors.map((error) => (<div>{error}</div>))}
                </Alert>
              )}
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Button
                className="eui-btn--blue display-modal"
                data-testid="detailed-progress-view-publish-draft-btn"
                onClick={() => {
                  this.publishDraft()
                }}
              >
                Publish
                {' '}
                {_.startCase(editor.documentType.split('_').at(0))}
                {' '}
                Draft
              </Button>
              {loading && (
                <div className="spinner-border spinner" role="status" />
              )}
              <span
                className="delete-draft"
                data-testid="detailed-progress-view-delete-draft-btn"
                onClick={() => { this.setState({ showModal: true }) }}
              >
                Delete
                {' '}
                {_.startCase(editor.documentType.split('_').at(0))}
                {' '}
                Draft
                {showModal && (
                  this.renderDeleteModal()
                )}
              </span>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Row>
                <Col md={12}>
                  {status && (
                    <Alert key={status} variant="warning">
                      {status}
                    </Alert>
                  )}
                </Col>
              </Row>
              <Row className="header">
                <Col md={12} className="header-col">
                  Metadata Fields
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="box">
                    {sectionList}
                  </div>
                  <div className="form">
                    <ReactJsonSchemaForm
                      validator={validator}
                      schema={fullSchema}
                      formData={draftJson}
                      transformErrors={(errors: RJSFValidationError[]) => {
                        const errorList = errors
                        if (JSON.stringify(editor.fullErrors) !== JSON.stringify(errorList)) {
                          editor.fullErrors = errorList
                        }
                        return errors
                      }}
                      liveValidate
                    />
                  </div>
                </Col>
              </Row>
            </Col>
            <Row>
              <Col md={12}>
                <div id="metadata-preview" />
              </Col>
            </Row>
          </Row>
        </Container>
      </div>
    )
  }
}
export default withRouter(observer(DetailedProgressView))
