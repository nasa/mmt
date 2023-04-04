/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import {
  Alert,
  Col, Container, Row
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

type DetailedProgressViewProps = {
  router: RouterType
  editor: MetadataEditor
}
type DetailedProgressViewState = {
  status: string
}

class DetailedProgressView extends React.Component<DetailedProgressViewProps, DetailedProgressViewState> {
  constructor(props: DetailedProgressViewProps) {
    super(props)
    this.state = { status: null }
  }
  componentDidMount() {
    const { router, editor } = this.props
    const { params } = router
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
      status
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
      <Container>
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
        </Row>
      </Container>
    )
  }
}
export default withRouter(observer(DetailedProgressView))
