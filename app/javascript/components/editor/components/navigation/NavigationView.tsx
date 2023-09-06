/* eslint-disable react/require-default-props */
import {
  Button, ButtonGroup, Dropdown, ListGroup
} from 'react-bootstrap'
import React from 'react'
import { observer } from 'mobx-react'
import { cloneDeep } from 'lodash'
import validator from '@rjsf/validator-ajv8'
import { RJSFValidationError } from '@rjsf/utils'
import NavigationItem from './NavigationItem'
import MetadataEditor from '../../MetadataEditor'
import withRouter from '../withRouter'
import Status from '../../model/Status'
import { removeEmpty } from '../../utils/json_utils'
import ReactJsonSchemaForm from '../ReactJsonSchemaForm'
import './NavigationView.css'

type NavigationViewProps = {
  router?: RouterType
  editor: MetadataEditor
}
type NavigationViewState = {
  saving: boolean
}
class NavigationView extends React.Component<NavigationViewProps, NavigationViewState> {
  constructor(props: NavigationViewProps) {
    super(props)
    this.state = {
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
          navigate(`/${editor.documentType}/${draft.apiId}/edit/${section.displayName.replace(/\s/g, '_')}`, { replace: false })
          editor.navigateTo(section)
        }
      }).catch((error) => {
        editor.status = new Status('warning', `error saving draft! ${error.message}`)
        this.setState({ saving: false })
      })
    })
  }

  saveAndPublish() {
    const { editor } = this.props
    const {
      draft
    } = editor
    const { model } = editor
    this.setState({ saving: true }, () => {
      editor.saveDraft(draft).then((draft) => {
        editor.draft = draft
        editor.publishDraft(draft).then((draft) => {
          const urlOrigin = window.location.origin
          editor.draft = draft
          editor.status = new Status('success', `Draft Published! ${draft.conceptId}/${draft.revisionId}`)
          editor.publishErrors = null
          if (model.shouldRedirectAfterPublish) {
            window.location.href = `${urlOrigin}//${editor.documentType.split('_').at(0)}s/${draft.conceptId}`
          }
          this.setState({ saving: false })
        }).catch((errors) => {
          editor.status = null
          editor.publishErrors = errors
          this.setState({ saving: false })
        })
      }).catch((error) => {
        editor.status = new Status('warning', `error saving draft! ${error.message}`)
        this.setState({ saving: false })
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
        if (editor.documentType === 'variable_drafts' || editor.documentType === 'service_draft') {
          window.location.href = `/${editor.documentType}/${draft.apiId}`
        } else {
          navigate(`/${editor.documentType}/${draft.apiId}`, { replace: false })
        }
      }).catch((error) => {
        editor.status = new Status('warning', `error saving draft! ${error.message}`)
        this.setState({ saving: false })
      })
    })
  }

  render() {
    const {
      editor
    } = this.props

    const {
      formSections, draft, fullSchema
    } = editor

    let { fullData: draftJson } = editor
    const { saving } = this.state

    draftJson = removeEmpty(cloneDeep(draftJson))

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
                window.scroll(0, 0)
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

              <Dropdown.Item onClick={() => {
                this.saveDraft(true)
                window.scroll(0, 0)
              }}
              >
                <span data-testid="navigationview--save-and-continue-button">
                  Save &amp; Continue
                </span>
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  this.saveAndPublish()
                }}
              >
                Save &amp; Publish

              </Dropdown.Item>

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
              this.setState({ saving: true }, () => {
                editor.fetchDraft(draft.apiId).then((draft) => {
                  editor.draft = draft
                  editor.status = new Status('info', 'Changes discarded.')
                  this.setState({ saving: false })
                }).catch((error) => {
                  editor.status = new Status('warning', `Error cancelling. ${error.message}`)
                  this.setState({ saving: false })
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
            <div className="spinner-border spinner" role="status" />
          )}
        </div>
        <ListGroup className="section-list">
          {sectionList}
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

        </ListGroup>
      </>
    )
  }
}
export default withRouter(observer(NavigationView))
