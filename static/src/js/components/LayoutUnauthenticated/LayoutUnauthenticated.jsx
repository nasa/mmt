import React from 'react'
import PropTypes from 'prop-types'
import { Outlet } from 'react-router-dom'
import classNames from 'classnames'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import Footer from '../Footer/Footer'
import Header from '../Header/Header'

/*
 * Renders a `LayoutUnauthenticated` component.
 *
 * The component is used to render the LayoutUnauthenticated for React Router
 *
 * @component
 * @example <caption>Render LayoutUnauthenticated component</caption>
 * return (
 *   <LayoutUnauthenticated />
 * )
 */
const LayoutUnauthenticated = ({ className }) => (
  <div
    className="d-flex flex-column w-100 flex-grow-0"
  >
    <ErrorBoundary>
      <>
        <Header />
        <main
          className={
            classNames([
              'w-100 h-100 d-flex flex-row',
              {
                [className]: className
              }
            ])
          }
        >
          <Outlet />
        </main>
        <Footer />
      </>
    </ErrorBoundary>
  </div>
)

LayoutUnauthenticated.defaultProps = {
  className: ''
}

LayoutUnauthenticated.propTypes = {
  className: PropTypes.string
}

export default LayoutUnauthenticated
