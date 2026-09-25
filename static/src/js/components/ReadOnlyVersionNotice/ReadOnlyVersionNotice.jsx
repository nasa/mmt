import PropTypes from 'prop-types'
import React from 'react'
import Alert from 'react-bootstrap/Alert'

import Button from '@/js/components/Button/Button'

const ReadOnlyVersionNotice = ({ onSwitchToDraft }) => (
  <Alert variant="info">
    <p>
      This keyword version is read-only. Select the DRAFT-NEXT RELEASE version
      to make changes, then publish a new keyword version to update production.
    </p>
    <Button variant="primary" onClick={onSwitchToDraft} disabled={!onSwitchToDraft}>
      Switch To Draft
    </Button>
  </Alert>
)

ReadOnlyVersionNotice.defaultProps = {
  onSwitchToDraft: null
}

ReadOnlyVersionNotice.propTypes = {
  onSwitchToDraft: PropTypes.func
}

export default ReadOnlyVersionNotice
