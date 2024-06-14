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
  const { setToken, tokenValue } = useAuthContext()

  useEffect(() => {
    setToken(null)
  }, [])

  if (tokenValue) return null

  return (
    <Navigate to="/" replace />
  )
}

export default LogoutPage
