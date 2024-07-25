import React, { Suspense } from 'react'
import PropTypes from 'prop-types'

import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Placeholder from 'react-bootstrap/Placeholder'

import LoadingBanner from '@/js/components/LoadingBanner/LoadingBanner'

import './Page.scss'

const PageHeaderPlaceholder = () => (
  <Placeholder className="d-flex flex-column" animation="glow" aria-hidden="true">
    <Placeholder className="mb-4 mt-1" style={{ width: '10rem' }} />
    <span className="d-flex justify-content-between">
      <Placeholder style={
        {
          width: '25rem',
          height: '1.5rem'
        }
      }
      />
      <span className="d-flex flex-grow-0">
        <Placeholder.Button className="ms-2 btn-light-dark" style={{ width: '6rem' }} />
        <Placeholder.Button className="ms-2 btn-light-dark" style={{ width: '7rem' }} />
        <Placeholder.Button className="ms-2 btn-light-dark" style={{ width: '2rem' }} />
      </span>
    </span>
  </Placeholder>
)

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
  <div className="page flex-grow-0 w-100 overflow-y-auto overflow-x-hidden">
    <Container fluid className="mx-0 mb-5">
      <Row className="py-3 mb-0">
        <Col className="px-4 px-md-5 pt-2 pt-md-4">
          <Suspense fallback={<PageHeaderPlaceholder />}>
            {header}
          </Suspense>
        </Col>
      </Row>
      <Row>
        <Col className="px-4 px-md-5 mt-4">
          <Suspense fallback={<LoadingBanner />}>
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
