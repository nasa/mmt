/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import {
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom'

function withRouter(Component:any) {
  const ComponentWithRouterProp = (props:any) => {
    const location = useLocation()
    const navigate = useNavigate()
    const params = useParams()
    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
      />
    )
  }
  ComponentWithRouterProp.WrappedComponent = Component
  return ComponentWithRouterProp
}
export default withRouter
