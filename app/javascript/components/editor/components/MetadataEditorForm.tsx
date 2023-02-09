/* eslint-disable react/require-default-props */
/* eslint-disable no-param-reassign */
import React from 'react'
import { observer } from 'mobx-react'
import {
  Row, Container, Col, Alert
} from 'react-bootstrap'
import Form from '@rjsf/bootstrap-4'
import JSONView from './JSONView'
import MetadataEditor from '../MetadataEditor'
import CustomTextWidget from './widgets/CustomTextWidget'
import CustomTextareaWidget from './widgets/CustomTextareaWidget'
import LayoutGridField from './LayoutGridField'
import CustomDateTimeWidget from './widgets/CustomDateTimeWidget'
import CustomFieldTemplate from './CustomFieldTemplate'
import CustomArrayTemplate from './CustomArrayTemplate'
import ToolKeywordsField from './ToolkeywordsField'
import ControlledFields from './ControlledFields'
import withRouter from './withRouter'
import NavigationView from './NavigationView'
import CustomSelectWidget from './widgets/CustomSelectWidget'

type MetadataEditorFormProps = {
  router?: RouterType
  editor: MetadataEditor;
  heading: string;
};
type MetadataEditorFormState = {
  status: string
}

class MetadataEditorForm extends React.Component<MetadataEditorFormProps, MetadataEditorFormState> {
  constructor(props: MetadataEditorFormProps) {
    super(props)
    this.state = { status: null }
    const { editor } = this.props
    CustomTextWidget.defaultProps = { options: { editor } }
    CustomTextareaWidget.defaultProps = { options: { editor } }
    CustomSelectWidget.defaultProps = { options: { editor } }
    ControlledFields.defaultProps = { options: { editor } }
    CustomArrayTemplate.defaultProps = { options: { editor } }
  }

  componentDidMount() {
    const { router, editor } = this.props
    const { params, location, navigate } = router
    let { sectionName } = params
    const { id } = params

    sectionName = editor.migratedSectionName(sectionName)
    if (sectionName) {
      editor.navigateToDisplayName(sectionName.replace(/_/g, ' '))
      const regexp = /#.+_draft_(.+)/
      if (location.hash) {
        const match = location.hash.match(regexp)
        if (match) {
          const fieldName = match[1]
          if (fieldName) {
            setTimeout(() => {
              editor.setFocusField(fieldName.replace(/_/g, ' '))
            }, 200)
          }
        }
      }
    }

    this.setState({ status: null }, () => {
      if (id) {
        editor.fetchDraft(Number(id)).then((draft) => {
          editor.draft = draft
        }).catch((error) => {
          this.setState({ status: `error retrieving draft! ${error.message}` })
        })
      } else {
        editor.saveDraft(editor.draft).then((draft) => {
          editor.draft = draft
          navigate(`/${editor.model.documentType}/${draft.apiId}/edit/${editor.currentSection.displayName.replace(/\s/g, '_')}`, { replace: false })
        }).catch((error) => {
          this.setState({ status: `error saving draft! ${error.message}` })
        })
      }
    })
  }

  componentDidUpdate(prevProps: Readonly<MetadataEditorFormProps>, prevState: Readonly<MetadataEditorFormState>, snapshot?: any): void {
    const oldSection = prevProps.editor.currentSection
    const { router, editor } = this.props
    const { params } = router
    let { sectionName } = params
    if (sectionName) {
      sectionName = editor.migratedSectionName(sectionName)
      const newSectionDisplayName = sectionName.replace(/_/g, ' ')
      if (oldSection.displayName.toLowerCase() !== newSectionDisplayName.toLowerCase()) {
        editor.navigateToDisplayName(newSectionDisplayName)
      }
    }
  }

  render() {
    const { editor } = this.props
    let { heading } = this.props
    if (!heading) {
      heading = `Create/Update a ${editor.documentTypeForDisplay}`
    }
    const fields = {
      layout: LayoutGridField,
      toolKeywordsField: ToolKeywordsField,
      controlled: ControlledFields
    }
    const widgets = {
      TextWidget: CustomTextWidget,
      TextareaWidget: CustomTextareaWidget,
      // SelectWidget: CustomSelectWidget,
      DateTimeWidget: CustomDateTimeWidget
    }
    const {
      formSchema: schema, formData, uiSchema, draft
    } = editor

    type OnChangeType = {
      formData: { [key: string]: object };
      errors: FormError[];
    };

    const { status } = this.state
    return (
      <Container id="metadata-form">
        <Row>
          <Col sm={8}>
            <h1>{ heading }</h1>
          </Col>
        </Row>
        <Row>
          <Col sm={8}>
            {status && (
              <Alert key={status} variant="warning">
                {status}
              </Alert>
            )}
          </Col>
        </Row>
        <Row className="sidebar_column">
          <Col sm={8}>
            <Form
              key={`${JSON.stringify(draft.key)}`}
              schema={schema}
              formData={formData}
              uiSchema={uiSchema}
              fields={fields}
              FieldTemplate={CustomFieldTemplate}
              ArrayFieldTemplate={CustomArrayTemplate}
              widgets={widgets}
              onChange={(e: OnChangeType) => {
                editor.formData = e.formData
                editor.formErrors = e.errors
              }}
              // liveValidate = {true}
              showErrorList
            />
          </Col>

          <div className="sidebar">
            <NavigationView editor={editor} />
          </div>
        </Row>
        <Row id="metadata-preview" style={{ marginTop: 10, marginBottom: 50 }}>
          <Col sm={8}>
            <JSONView editor={editor} />
          </Col>
        </Row>
      </Container>
    )
  }
}
export default withRouter(observer(MetadataEditorForm))
