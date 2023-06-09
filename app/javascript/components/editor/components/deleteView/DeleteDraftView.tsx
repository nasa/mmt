import React from 'react'
import { Alert, Button } from 'react-bootstrap'
import MetadataEditor from '../../MetadataEditor'
import withRouter from '../withRouter'

type DeleteDraftViewProps = {
  router: RouterType
  editor: MetadataEditor
}
class DeleteDraftView extends React.Component<DeleteDraftViewProps, any> {
  render() {
    const { editor, router } = this.props
    const { navigate } = router

    return (
      <div style={{ margin: 'auto', width: '60%', padding: '10px' }}>
        {editor.status && (
          <Alert key={editor.status.type} variant={editor.status.type} onClose={() => { editor.status = null }} dismissible>
            {editor.status.message}
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
