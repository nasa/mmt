/* eslint-disable no-plusplus */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { get, set } from 'tiny-cookie'
import { useCookies } from 'react-cookie'

/**
 * This class handles the authenticated redirect from our saml lambda function.
 * We get the launchpad token and redirect to the specified path and redirect
 * the user to the correct location based on where they were trying to get before logging
 * in.
 */

export const AuthCallbackContainer = () => {
  const [searchParams] = useSearchParams()
  const jwtToken = searchParams.get('jwt')
  const path = searchParams.get('target')

  // const [cookies, setCookie] = useCookies(['SBXSESSION'])

  const cookies = document.cookie.split(';')

  for (let i = 0; i < cookies.length; i++) {
    console.log('cookie=', cookies[i])
  }

  const navigate = useNavigate()
  console.log('document cookie=', document.cookie)

  if (jwtToken) {
    const obj = jwtDecode(jwtToken)
    console.log('cookies=', cookies)
    // console.log('path to navigate is ', path)
    // console.log('obj is ', obj)

    // useEffect(() => {
    //   console.log('setting token to ', token)
    //   // Navigate(path)
    // }, [])
  }

  return <div />
}

AuthCallbackContainer.propTypes = {
}

export default AuthCallbackContainer
