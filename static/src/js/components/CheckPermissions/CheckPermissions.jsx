import React from 'react'
import PropTypes from 'prop-types'
import { Navigate, Outlet } from 'react-router'

import usePermissions from '@/js/hooks/usePermissions'

/**
 * Redirects the user if they do not have the given permission
 * @param {Object} params Object containing permissions to check
 * @param {Array} params.systemGroup Array of permissions to check in the system object 'GROUP'
 */
const CheckPermissions = ({
  systemGroup
}) => {
  const { hasSystemGroup, loading } = usePermissions({
    systemGroup
  })

  if (loading) {
    return (
      <div data-testid="auth-required" className="route-wrapper" />
    )
  }

  if (systemGroup && hasSystemGroup) {
    return <Outlet />
  }

  return <Navigate to="/" />
}

CheckPermissions.defaultProps = {
  systemGroup: null
}

CheckPermissions.propTypes = {
  systemGroup: PropTypes.arrayOf(PropTypes.string)
}

export default CheckPermissions
