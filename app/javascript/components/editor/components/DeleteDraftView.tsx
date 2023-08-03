import React from 'react'
import { Alert, Button } from 'react-bootstrap'
import MetadataEditor from '../MetadataEditor'
import withRouter from './withRouter'

type DeleteDraftViewProps = {
  router: RouterType
  editor: MetadataEditor
}
class DeleteDraftView extends React.Component<DeleteDraftViewProps, never> {
  render() {
    const { editor, router } = this.props
    const { status } = editor
    const { navigate } = router

    return (
      <div style={{ margin: 'auto', width: '60%', padding: '10px' }}>
        {status && (
          <Alert key={status.type} variant={status.type} onClose={() => { editor.status = null }} dismissible>
            {status.message}
          </Alert>
        )}
        <Button
          data-testid="create-new-draft"
          onClick={() => {
            editor.status = null
            navigate(`/${editor.model.documentType}/new`, { replace: true })
          }}
        >
          Create Tool Draft
        </Button>
      </div>
    )
  }
}
export default withRouter(DeleteDraftView)
