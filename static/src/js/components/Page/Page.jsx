import React, { Suspense } from 'react'
import PropTypes from 'prop-types'

import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import './Page.scss'

/**
 * @typedef {Object} PageProps
 * @property {ReactNode} children The page content.
 * @property {ReactNode} header The header component to render.
 */

/*
 * Renders a `Page` component.
 *
 * The component is used to create a page
 *
 * @param {PageProps} props
 *
 * @component
 * @example <caption>Render a page</caption>
 * return (
 *   <Page header={<ExamplePageHeader />}>
 *      <div>This is some page content</div>
 *   </Page>
 * )
 */
const Page = ({
  children,
  header
}) => (
  <div className="w-100 overflow-hidden">
    <Container fluid className="mx-0 mb-5">
      <Row className="py-3 mb-0">
        <Col className="px-5 pt-0">
          <Suspense fallback="Loading...">
            {header}
          </Suspense>
        </Col>
      </Row>
      <Row>
        <Col className="px-5 mt-4">
          <Suspense fallback="Loading...">
            {children}
          </Suspense>
        </Col>
      </Row>
    </Container>
  </div>
)

Page.defaultProps = {
  children: []
}

Page.propTypes = {
  children: PropTypes.node,
  header: PropTypes.node.isRequired
}

export default Page
