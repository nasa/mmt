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
import CustomTextareaWidget from './widgets/CustomTextareaWidget'
import LayoutGridField from './LayoutGridField'
import CustomDateTimeWidget from './widgets/CustomDateTimeWidget'
import CustomFieldTemplate from './CustomFieldTemplate'
import CustomArrayTemplate from './CustomArrayTemplate'
import ControlledFields from './ControlledFields'
import withRouter from './withRouter'
import NavigationView from './NavigationView'
import CustomSelectWidget from './widgets/CustomSelectWidget'
import CustomCountrySelectWidget from './widgets/CustomCountrySelectWidget'
import StreetAddressesField from './StreetAddresseField'
import CustomTextWidget from './widgets/CustomTextWidget'
import KeywordsField from './KeywordPicker'
import CustomTitleFieldTemplate from './CustomTitleFieldTemplate'
import Status from '../model/Status'

type MetadataEditorFormProps = {
  router?: RouterType
  editor: MetadataEditor;
  heading: string;
};

class MetadataEditorForm extends React.Component<MetadataEditorFormProps, never> {
  constructor(props: MetadataEditorFormProps) {
    super(props)
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

    if (id) {
      editor.loading = true
      editor.fetchDraft(Number(id)).then((draft) => {
        editor.draft = draft
        editor.loading = false
      }).catch((error) => {
        editor.status = new Status('warning', `error retrieving draft! ${error.message}`)
        editor.loading = false
      })
    } else {
      editor.saveDraft(editor.draft).then((draft) => {
        editor.draft = draft
        editor.loading = false
        navigate(`/${editor.model.documentType}/${draft.apiId}/edit/${editor.currentSection.displayName.replace(/\s/g, '_')}`, { replace: false })
      }).catch((error) => {
        editor.status = new Status('warning', `error saving draft! ${error.message}`)
        editor.loading = false
      })
    }
  }

  componentDidUpdate(prevProps: Readonly<MetadataEditorFormProps>): void {
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
      controlled: ControlledFields,
      streetAddresses: StreetAddressesField,
      keywordPicker: KeywordsField,
      TitleField: CustomTitleFieldTemplate
    }
    const widgets = {
      TextWidget: CustomTextWidget,
      TextareaWidget: CustomTextareaWidget,
      SelectWidget: CustomSelectWidget,
      DateTimeWidget: CustomDateTimeWidget,
      CountrySelectWiget: CustomCountrySelectWidget
    }
    const {
      formSchema: schema, formData, uiSchema, draft, publishErrors, status
    } = editor

    type OnChangeType = {
      formData: { [key: string]: object };
      errors: FormError[];
    };

    // if (loading) {
    //   return (
    //     <div id="react-editor-form-containter">
    //       <Card
    //         style={{
    //           display: 'flex',
    //           width: 1000,
    //           height: 800,
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
      <div id="react-editor-form-containter">
        <Container id="metadata-form">
          <Row>
            <Col sm={8}>
              <h1>{ heading }</h1>
            </Col>
          </Row>
          <Row>
            <Col sm={8}>
              {status && (
              <Alert key={status.type} variant={status.type} onClose={() => { editor.status = null }} dismissible>
                {status.message}
              </Alert>
              )}
            </Col>
          </Row>

          <Row>
            <Col sm={8}>
              {publishErrors && publishErrors.length > 0 && (
              <Alert key={JSON.stringify(status)} variant="warning" onClose={() => { editor.publishErrors = null }} dismissible>
                <h5>Errors Publishing Record</h5>
                { publishErrors.map((error) => (<div>{error}</div>)) }
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
          <Row style={{ marginTop: 10, marginBottom: 50 }}>
            <Col sm={8}>
              <JSONView editor={editor} />
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}
export default withRouter(observer(MetadataEditorForm))
