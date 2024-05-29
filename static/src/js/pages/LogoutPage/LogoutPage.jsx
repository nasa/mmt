import React, { useEffect } from 'react'
import { Navigate } from 'react-router'

import useAuthContext from '@/js/hooks/useAuthContext'

/**
 * Renders a `LogoutPage` component, this component will clear the cookie and navigate to the home page
 *
 * @component
 * @example <caption>Renders a `LogoutPage` component</caption>
 * return (
 *   <LogoutPage />
 * )
 */
const LogoutPage = () => {
  const { setToken } = useAuthContext()

  useEffect(() => {
    setToken(null)
  }, [])

  return (
    <Navigate to="/" />
  )
}

export default LogoutPage
