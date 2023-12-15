import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import For from '../For/For'

/**
 * @typedef {Object} SectionEntry
 * @property {ReactNode} children A required React node to be used as the section content.
 * @property {String} key A required unique string to be used as a React key.
 * @property {Boolean} [separate] An optional boolean to trigger the display of borders to visually separate the section.
 */

/**
 * @typedef {Object} ManageSectionProps
 * @property {String} [className] An optional string representing the title of the section.
 * @property {Array.<SectionEntry>} sections The page content.
 * @property {String} title A required string representing the title of the section.
 */

/**
 * Renders a `ManageSection` component
 *
 * @component
 * @example <caption>Renders a `ManageSection` component</caption>
 * return (
 *   <ManageSection />
 * )
 */
const ManageSection = ({
  className,
  sections,
  title
}) => (
  <Col
    className={
      classNames([
        'd-flex row-height position-relative mb-4 mb-lg-0',
        {
          [className]: !!className
        }
      ])
    }
    key={title}
    lg={4}
    md={6}
  >
    <section className="bg-white p-3 w-100">
      <h2
        className="d-block mb-0 bg-primary text-white h5 py-3 border-5 border-end border-indigo"
        style={
          {
            position: 'relative',
            paddingLeft: '2rem',
            paddingRight: '1rem',
            left: 'calc(-2rem)',
            width: 'calc(100% + 2rem)',
            fontWeight: 700
          }
        }
      >
        {title}
      </h2>

      <Container>
        <Row>
          <For each={sections}>
            {
              ({ key, children, separate }) => (
                <Col
                  key={key}
                  className={
                    classNames([
                      'p-0',
                      {
                        'border-bottom border-secondary': separate
                      }
                    ])
                  }
                  sm={12}
                >
                  <div className={
                    classNames(
                      [
                        {
                          'py-3': separate
                        }
                      ]
                    )
                  }
                  >
                    {children}
                  </div>
                </Col>
              )
            }
          </For>
        </Row>
      </Container>
    </section>
  </Col>
)

ManageSection.defaultProps = {
  className: null
}

ManageSection.propTypes = {
  className: PropTypes.string,
  sections: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  title: PropTypes.string.isRequired
}

export default ManageSection
