import React from 'react'
import PropTypes from 'prop-types'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { FaQuestionCircle, FaSignInAlt } from 'react-icons/fa'

import Page from '../../components/Page/Page'

import './HomePage.scss'
import For from '../../components/For/For'
import Button from '../../components/Button/Button'
import useAppContext from '../../hooks/useAppContext'

/**
 * Renders a `HomePagePanel` component.
 *
 * This is intended be used within the `HomePage` component.
 *
 * @component
 * @example <caption>Renders a `HomePagePanel` component</caption>
 * return (
 *   <HomePagePanel title="This will display as the title">
 *     This text will be in the body of the panel
 *   </HomePagePanel>
 * )
 */
const HomePagePanel = ({
  children,
  title
}) => (
  <Col className="d-flex mb-4" sm={12} md={6} lg={5}>
    <div
      className="home-page__panel-content bg-black text-white p-4 border-start border-4 border-pink"
      style={{ '--bs-text-opacity': 0.95 }}
    >
      <div className="d-flex align-items-center mb-3">
        <FaQuestionCircle className="me-2 d-block text-opacity-75" />
        <h2 className="h6 mb-0 text-uppercase fw-bold">
          {' '}
          {title}
        </h2>
      </div>
      <p className="mb-0 small">{children}</p>
    </div>
  </Col>
)

HomePagePanel.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired
}

/**
 * Renders a `HomePage` component
 *
 * @component
 * @example <caption>Renders a `HomePage` component</caption>
 * return (
 *   <HomePage />
 * )
 */
const HomePage = () => {
  const { login, user } = useAppContext()

  const panels = [
    {
      title: 'About the Metadata Management Tool (MMT)',
      body: 'The MMT is a web-based user interface to the NASA EOSDIS Common Metadata Repository (CMR). The MMT allows metadata authors to create and update CMR metadata records by using a data entry form based on the metadata fields in the CMR Unified Metadata Model (UMM). Metadata authors may also publish, view, delete, and manage revisions of CMR metadata records using the MMT.'
    },
    {
      title: 'About the Common Metadata Repository (CMR)',
      body: 'The CMR is a high-performance, high-quality metadata repository for earth science metadata records. The CMR manages the evolution of NASA Earth Science metadata in a unified and consistent way by providing a central storage and access capability that streamlines current workflows while increasing overall metadata quality and anticipating future capabilities.'
    }
  ]

  return (
    <Page title="Home" navigation={false} hasBackgroundImage>
      <Row className="mt-4">
        <Col xs={12} sm={10} lg={5} className="mx-auto">
          <div className="d-flex flex-column justify-content-center align-items-center">
            <p className="home-page__intro-text text-white fw-bold h4 mb-4 text-center">
              Manage NASA Common Metadata Repository metadata with the Metadata Management Tool
            </p>
            {
              !user?.name && (
                <Button
                  className="shadow"
                  size="lg"
                  variant="success text-white"
                  Icon={FaSignInAlt}
                  onClick={
                    () => {
                      login()
                    }
                  }
                >
                  Log in with Launchpad
                </Button>
              )
            }
          </div>
        </Col>
      </Row>
      <Row className="mt-5 justify-content-md-center">
        <For each={panels}>
          {
            ({ title, body }) => (
              <HomePagePanel key={title} title={title}>
                {body}
              </HomePagePanel>
            )
          }
        </For>
      </Row>
    </Page>
  )
}

export default HomePage
