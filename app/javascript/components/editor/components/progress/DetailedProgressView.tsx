/* eslint-disable no-param-reassign */
import {
  Alert,
  Col, Container, Row
} from 'react-bootstrap'
import React from 'react'
import { observer } from 'mobx-react'
import _ from 'lodash'
import Form from '@rjsf/bootstrap-4'
import MetadataEditor from '../../MetadataEditor'
import withRouter from '../withRouter'
import ProgressSection from './ProgressSection'
import { FieldInfo } from './FieldInfo'
import { ProgressCircleType } from './ProgressCircleType'
import { removeEmpty } from '../../utils/json_utils'

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
    const { fullData, fullErrors } = editor
    const draft = JSON.parse(JSON.stringify(fullData))

    const hasValues = section.properties.some((propertyPrefix) => {
      const value = draft[propertyPrefix]
      return value !== undefined
    })
    if (!hasValues) {
      return ProgressCircleType.NotStarted
    }
    const hasError = fullErrors.some((error: FormError) => {
      const { property } = error
      return section.properties.some((propertyPrefix) => {
        if (property.startsWith(`.${propertyPrefix}`)) {
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
    if (!fieldValue) {
      const fieldInfo = new FieldInfo(section.displayName, propertyPrefix, null, ProgressCircleType.NotStarted, isRequired, null)
      fields.push(fieldInfo)
    } else {
      const errorList = fullErrors.filter((error: FormError) => {
        const { property } = error
        return property.startsWith(`.${propertyPrefix}`)
      })
      if (errorList.length > 0) {
        const fieldInfo = new FieldInfo(section.displayName, propertyPrefix, null, ProgressCircleType.Error, isRequired, errorList[0])
        fields.push(fieldInfo)
      } else {
        const fieldInfo = new FieldInfo(section.displayName, propertyPrefix, null, ProgressCircleType.Pass, isRequired, null)
        fields.push(fieldInfo)
      }
    }
  }

  private addFields(fieldValues: object[], section: FormSection, propertyPrefix: string, isRequired: boolean, fields: FieldInfo[], fullErrors: FormError[]) {
    fieldValues.forEach((name, index) => {
      const fieldInfo = new FieldInfo(section.displayName, propertyPrefix, index, ProgressCircleType.Pass, isRequired, null)
      fields.push(fieldInfo)
    })
    const hasError = fullErrors.some((error: FormError) => {
      const { property } = error
      return property.startsWith(`.${propertyPrefix}`)
    })
    if (hasError) { // determine which one in the array has the error
      fullErrors.forEach((error: FormError) => {
        const { property } = error
        if (property.startsWith(`.${propertyPrefix}`)) {
          const regexp = /^[^[]+\[(\d+)\].*/
          const match = property.match(regexp)
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
          style={{ padding: 10, flex: '33.33%' }}
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

    // if (loading) {
    //   return (
    //     <div id="react-editor-form-containter">
    //       <Card
    //         style={{
    //           display: 'flex',
    //           width: 1000,
    //           height: 400,
    //           alignItems: 'center',
    //           justifyContent: 'center'
    //         }}
    //         id="metadata-form"
    //       >
    //         <div style={{ display: 'flex', alignItems: 'center' }}>
    //           <h5>Loading...&nbsp;&nbsp;</h5>
    //           <div className="spinner-grow text-success" role="status">
    //             <span className="sr-only">Loading...</span>
    //           </div>
    //         </div>
    //       </Card>
    //     </div>
    //   )
    // }

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
            <Row style={{ fontSize: 21, fontWeight: 'bold' }}>
              <Col md={12} style={{ marginLeft: 23, padding: 15 }}>
                Metadata Fields
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="box">
                  {sectionList}
                </div>
                <div style={{ display: 'none' }}>
                  <Form
                    schema={fullSchema}
                    formData={draftJson}
                    transformErrors={(errors: FormError[]) => {
                      if (JSON.stringify(editor.fullErrors) !== JSON.stringify(errors)) {
                        editor.fullErrors = errors
                      }
                      return errors
                    }}
                    liveValidate
                    showErrorList
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
