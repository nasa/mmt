import React from 'react'
import { Outlet } from 'react-router-dom'

import Header from '../Header/Header'
import Footer from '../Footer/Footer'

/*
 * Renders a `Layout` component.
 *
 * The component is used to render the Layout for React Router
 *
 * @component
 * @example <caption>Render Layout component</caption>
 * return (
 *   <Layout />
 * )
 */
const Layout = () => (
  <div className="d-flex flex-column w-100 overflow-auto">
    <Header />
    <Outlet />
    <Footer />
  </div>
)

export default Layout
