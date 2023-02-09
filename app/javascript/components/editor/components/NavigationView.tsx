/* eslint-disable react/require-default-props */
import {
  Alert, Button, ButtonGroup, Dropdown, ListGroup
} from 'react-bootstrap'
import React from 'react'
import { observer } from 'mobx-react'
import Form from '@rjsf/bootstrap-4'
import NavigationItem from './NavigationItem'
import MetadataEditor from '../MetadataEditor'
import withRouter from './withRouter'

type ProgressViewProps = {
  router?: RouterType
  editor: MetadataEditor
}
type ProgressViewState = {
  saving: boolean
  status: string
}
class ProgressView extends React.Component<ProgressViewProps, ProgressViewState> {
  constructor(props: ProgressViewProps) {
    super(props)
    this.state = {
      status: null,
      saving: false
    }
  }
  saveDraft(navigateNext: boolean) {
    const { editor, router } = this.props
    const { navigate } = router
    const {
      draft
    } = editor
    this.setState({ saving: true }, () => {
      editor.saveDraft(draft).then((draft) => {
        editor.draft = draft
        this.setState({ saving: false })
        if (navigateNext) {
          const section = editor.nextSection()
          navigate(`/tool_drafts/${draft.apiId}/edit/${section.displayName.replace(/\s/g, '_')}`, { replace: false })
          editor.navigateTo(section)
        }
      }).catch((error) => {
        this.setState({ status: `error saving draft! ${error.message}` })
      })
    })
  }

  saveDraftAndPreview() {
    const {
      editor, router
    } = this.props
    const { navigate } = router
    const {
      draft
    } = editor
    this.setState({ saving: true }, () => {
      editor.saveDraft(draft).then((draft) => {
        editor.draft = draft
        this.setState({ saving: false })
        // this will be needed to redirect to the preview page which is rendered by rails
        setTimeout(() => {
          window.location.href = `/tool_drafts/${draft.apiId}`
        }, 50)
        // } else {
        // navigate(`/tool_drafts/${draft.apiId}`, { replace: false })
        // }
      }).catch((error) => {
        this.setState({ status: `error saving draft! ${error.message}` })
      })
    })
  }

  render() {
    const {
      editor
    } = this.props

    const {
      formSections, draft, fullSchema, fullData: draftJson
    } = editor

    const { status, saving } = this.state

    const sectionList = formSections.map((section: FormSection) => (
      <NavigationItem key={JSON.stringify(section)} editor={editor} section={section} />
    ))
    return (
      <>
        <div>
          <Dropdown as={ButtonGroup}>
            <Button
              onClick={() => {
                this.saveDraft(true)
              }}
              variant="success"
            >
              <span data-testid="navigationview--save-and-continue-button">
                Save &amp; Continue
              </span>
            </Button>
            <Dropdown.Toggle
              data-testid="navigationview--dropdown-toggle"
              split
              variant="success"
              id="dropdown-split-basic"
            />
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => {
                this.saveDraft(false)
              }}
              >
                <span data-testid="navigationview--save-draft-button">
                  Save
                </span>
              </Dropdown.Item>
              <Dropdown.Item href="#/action-2">Save &amp; Publish</Dropdown.Item>
              <Dropdown.Item onClick={() => {
                this.saveDraftAndPreview()
              }}
              >
                <span data-testid="navigationview--save-and-preview">
                  Save &amp; Preview
                </span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          &nbsp;
          <button
            data-testid="navigationview--cancel-button"
            onClick={() => {
              this.setState({ status: null }, () => {
                editor.fetchDraft(draft.apiId).then((draft) => {
                  editor.draft = draft
                  this.setState({ status: 'Changes discarded' })
                }).catch((error) => {
                  this.setState({ status: `Error cancelling. ${error.message}` })
                })
              })
            }}
            type="button"
            className="link-button"
          >
            Cancel
          </button>
          &nbsp;&nbsp;
          {saving && (
            <div style={{ width: 24, height: 24 }} className="spinner-border" role="status" />
          )}
          {status && (
            <div
              className="alert-warning"
              style={{
                fontSize: 10, height: 20, display: 'inline'
              }}
              key={status}
              // variant="warning"
            >
              {status}
            </div>
          )}
        </div>
        <ListGroup style={{ height: 400, width: 300, marginTop: 5 }}>
          {sectionList}
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

        </ListGroup>
      </>
    )
  }
}
export default withRouter(observer(ProgressView))
