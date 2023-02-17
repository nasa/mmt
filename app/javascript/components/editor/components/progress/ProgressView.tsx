import {
  Alert, Button, ButtonGroup, Dropdown, ListGroup
} from 'react-bootstrap'
import React from 'react'
import { observer } from 'mobx-react'
import Form from '@rjsf/bootstrap-4'
import NavigationItem from '../NavigationItem'
import MetadataEditor from '../../MetadataEditor'

type ProgressViewProps = {
  router: RouterType
  editor: MetadataEditor
}
type ProgressViewState = {
  status: string
}

class ProgressView extends React.Component<ProgressViewProps, ProgressViewState> {
  constructor(props: ProgressViewProps) {
    super(props)
    this.state = {
      status: null
    }
  }
  saveDraft(navigateNext: boolean) {
    const { editor, router } = this.props
    const { navigate } = router
    const {
      draft
    } = editor
    this.setState({ status: null }, () => {
      editor.saveDraft(draft).then((draft) => {
        editor.draft = draft
        this.setState({ status: 'Draft Saved' })
        if (navigateNext) {
          editor.navigateNext()
          navigate(`/tool_draft/${draft.apiId}/edit/${editor.currentSection.displayName.replace(/\s/g, '_')}`, { replace: false })
        }
      }).catch((error) => {
        this.setState({ status: `error saving draft! ${error.message}` })
      })
    })
  }
  render() {
    const {
      editor, router
    } = this.props
    const { navigate } = router

    const {
      formSections, fullSchema, fullData: draftJson, draft
    } = editor

    const { status } = this.state

    const sectionList = formSections.map((section: FormSection) => (
      <NavigationItem key={JSON.stringify(section)} editor={editor} section={section} />
    ))
    return (
      <>
        <div>
          <Dropdown as={ButtonGroup}>
            <Button
              onClick={() => {
                this.saveDraft(false)
              }}
              variant="success"
            >
              <span data-testid="navigationview--save-draft-button">
                SAVE
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
                this.saveDraft(true)
              }}
              >
                <span data-testid="navigationview--save-and-continue-button">
                  Save &amp; Continue
                </span>
              </Dropdown.Item>
              <Dropdown.Item href="#/action-2">Save &amp; Publish</Dropdown.Item>
              <Dropdown.Item onClick={() => {
                navigate(`/tool_draft/progress/${draft.apiId}`, { replace: false })
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
          {status && (
            <Alert style={{ height: 20, display: 'inline' }} key={status} variant="warning">
              {status}
            </Alert>
          )}
        </div>
        <ListGroup style={{ height: 400, width: 300 }}>
          {sectionList}
        </ListGroup>
        <div style={{ display: 'none' }}>
          <Form
            schema={fullSchema}
            formData={draftJson}
            transformErrors={(errors: FormError[]) => {
              editor.fullErrors = errors
              return errors
            }}
            liveValidate
            showErrorList
          />
        </div>
      </>
    )
  }
}
export default observer(ProgressView)
