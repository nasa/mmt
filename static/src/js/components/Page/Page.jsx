import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import Breadcrumb from 'react-bootstrap/Breadcrumb'
import {
  Badge,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from 'react-bootstrap'
import { snakeCase } from 'lodash-es'
import { FaEllipsisV } from 'react-icons/fa'

import { getUmmVersionsConfig } from '../../../../../sharedUtils/getConfig'

import Button from '../Button/Button'
import PrimaryNavigation from '../PrimaryNavigation/PrimaryNavigation'
import For from '../For/For'

import './Page.scss'

const CustomToggle = React.forwardRef(
  ({
    onClick
  }, ref) => (
    <Button
      href=""
      variant="light-dark"
      iconOnly
      Icon={FaEllipsisV}
      iconTitle="A vertical ellipsis icon"
      ref={ref}
      onClick={
        (e) => {
          e.preventDefault()
          onClick(e)
        }
      }
    >
      More Actions
    </Button>
  )
)

CustomToggle.displayName = 'CustomToggle'

CustomToggle.propTypes = {
  onClick: PropTypes.func.isRequired
}

const CustomMenu = React.forwardRef(
  ({
    children,
    style,
    className,
    'aria-labelledby': labelledBy
  }, ref) => (
    <div
      ref={ref}
      style={style}
      className={
        classNames([
          'shadow',
          {
            [className]: className
          }
        ])
      }
      aria-labelledby={labelledBy}
    >
      <div className="mb-0">
        {children}
      </div>
    </div>
  )
)

CustomMenu.displayName = 'CustomMenu'

CustomMenu.propTypes = {
  children: PropTypes.shape().isRequired,
  className: PropTypes.string,
  style: PropTypes.shape().isRequired,
  'aria-labelledby': PropTypes.string.isRequired
}

CustomMenu.defaultProps = {
  className: null
}

/**
 * @typedef {Object} PrimaryAction
 * @property {ReactNode} icon The icon for the action.
 * @property {Function} onClick The onClick callback for the action.
 * @property {String} title The label for the action.
 * @property {String} to The location to be passed to react router.
 * @property {String} variant The Bootstrap variant for the button".
 */

/**
 * @typedef {Object} AdditionalAction
 * @property {Function} onClick The onClick callback for the action.
 * @property {String} count The label for the action.
 * @property {String} to The location to be passed to react router.
 */

/**
 * @typedef {Object} Breadcrumb
 * @property {String} label The label for the header action.
 * @property {String} to The location to be set when clicked.
 * @property {Boolean} active A boolean flag to trigger the active state
 */

/**
 * @typedef {Object} PageProps
 * @property {Array.<AdditionalAction>} additionalActions The additional header actions, displayed in a dripdown list.
 * @property {Array.<Breadcrumb>} breadcrumbs The page content.
 * @property {ReactNode} children The page content.
 * @property {Array.<PrimaryAction>} primaryActions The primary actions displayed in the header.
 * @property {String} pageType A string representing the type of page.
 * @property {String} secondaryTitle A secondary title.
 * @property {String} title A string of text to serve as the page title.
 */

/*
 * Renders a `For` component.
 *
 * The component is used to create a page
 *
 * @param {PageProps} props
 *
 * @component
 * @example <caption>Render a page</caption>
 * return (
 *   <Page
 *      title="This is a title"
 *      pageType="primary"
 *      headerActions={[{ label: 'Action Label', to="/action/location" }]}
 *   >
 *      <div>This is some page content</div>
 *   </Page>
 * )
 */
const Page = ({
  breadcrumbs,
  children,
  className,
  navigation,
  pageType,
  primaryActions,
  additionalActions,
  title
}) => {
  const {
    ummC,
    ummS,
    ummT,
    ummV
  } = getUmmVersionsConfig()

  return (
    <main
      className={
        classNames([
          'flex-grow-1 d-flex flex-row',
          {
            [className]: className
          }
        ])
      }
    >
      {
        navigation && (
          <header className="page__header d-flex grow-0 flex-shrink-0">
            <PrimaryNavigation
              items={
                [
                  {
                    to: '/collections',
                    title: 'Collections',
                    version: `v${ummC}`,
                    children: [
                      {
                        to: '/drafts/collections',
                        title: 'Drafts'
                      },
                      {
                        to: '/templates/collections',
                        title: 'Templates'
                      }
                    ]
                  },
                  {
                    to: '/variables',
                    title: 'Variables',
                    version: `v${ummV}`,
                    children: [
                      {
                        to: '/drafts/variables',
                        title: 'Drafts'
                      }
                    ]
                  },
                  {
                    to: '/services',
                    title: 'Services',
                    version: `v${ummS}`,
                    children: [
                      {
                        to: '/drafts/services',
                        title: 'Drafts'
                      }
                    ]
                  },
                  {
                    to: '/tools',
                    title: 'Tools',
                    version: `v${ummT}`,
                    children: [
                      {
                        to: '/drafts/tools',
                        title: 'Drafts'
                      }
                    ]
                  },
                  {
                    to: '/order-options',
                    title: 'Order Options'
                  }
                ]
              }
            />
          </header>
        )
      }

      <div className="w-100 overflow-hidden">
        <Container fluid className="mx-0 mb-5">
          <Row className="py-3 mb-0">
            <Col className="px-5 pt-0">
              <header
                className={
                  classNames(
                    [
                      'd-flex flex-column align-items-start',
                      {
                        'sr-only': pageType === 'primary',
                        '': pageType !== 'primary'
                      }
                    ]
                  )
                }
              >
                {
                  breadcrumbs.length > 0 && (
                    <Breadcrumb>
                      <For each={breadcrumbs}>
                        {
                          ({ active, label, to }, i) => {
                            if (!label) return null

                            return (
                              <Breadcrumb.Item
                                key={`breadcrumb-link_${to}_${i}`}
                                active={active}
                                linkProps={{ to }}
                                linkAs={Link}
                              >
                                {label}
                              </Breadcrumb.Item>
                            )
                          }
                        }
                      </For>
                    </Breadcrumb>
                  )
                }
                <div className="d-flex w-100 align-items-center justify-content-between">
                  <h2
                    className="m-0 text-gray-200 fs-2"
                    style={
                      {
                        fontWeight: 700,
                        letterSpacing: '-0.015rem'
                      }
                    }
                  >
                    {title}
                  </h2>
                  {
                    primaryActions && (
                      <div className="d-flex flex-row">
                        <For each={primaryActions}>
                          {
                            (
                              {
                                icon,
                                iconTitle,
                                onClick,
                                title: buttonTitle,
                                to,
                                variant
                              }
                            ) => {
                              if (to) {
                                return (
                                  <Link
                                    key={buttonTitle}
                                    to={to}
                                  >
                                    <Button
                                      className="ms-2"
                                      as={Button}
                                      size="sm"
                                      Icon={icon}
                                      iconTitle={iconTitle}
                                      variant={variant}
                                    >
                                      {buttonTitle}
                                    </Button>
                                  </Link>
                                )
                              }

                              return (
                                <Button
                                  className="ms-2"
                                  size="sm"
                                  key={buttonTitle}
                                  Icon={icon}
                                  iconTitle={iconTitle}
                                  variant={variant}
                                  onClick={onClick}
                                >
                                  {buttonTitle}
                                </Button>
                              )
                            }
                          }
                        </For>
                        {
                          additionalActions && (
                            <Dropdown className="ms-2" align="end">
                              <DropdownToggle as={CustomToggle} id="dropdown-custom-components" />
                              <DropdownMenu as={CustomMenu}>
                                <For each={additionalActions}>
                                  {
                                    (
                                      {
                                        count: actionCount,
                                        onClick: actionOnClick,
                                        title: actionTitle
                                      }
                                    ) => (
                                      <DropdownItem
                                        className="d-flex flex-row align-items-center"
                                        key={actionTitle}
                                        eventKey={snakeCase(actionTitle)}
                                        onClick={actionOnClick}
                                      >
                                        <span>{actionTitle}</span>
                                        {
                                          actionCount !== null && (
                                            <Badge
                                              className="ms-2 text-secondary"
                                              pill
                                              bg="light-dark"
                                            >
                                              {actionCount}
                                            </Badge>
                                          )
                                        }
                                      </DropdownItem>
                                    )
                                  }
                                </For>
                              </DropdownMenu>
                            </Dropdown>
                          )
                        }
                      </div>
                    )
                  }
                </div>
              </header>
            </Col>
          </Row>
          <Row>
            <Col className="px-5 mt-4">
              {children}
            </Col>
          </Row>
        </Container>
      </div>
    </main>
  )
}

Page.defaultProps = {
  additionalActions: null,
  breadcrumbs: [],
  className: null,
  navigation: true,
  pageType: 'primary',
  primaryActions: [],
  title: null
}

Page.propTypes = {
  additionalActions: PropTypes.arrayOf(
    PropTypes.shape({
      count: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      onClick: PropTypes.func.isRequired,
      title: PropTypes.string.isRequired
    }).isRequired
  ),
  // Disabling the following rule to allow undefined to be passed as a value in the array
  // eslint-disable-next-line react/forbid-prop-types
  breadcrumbs: PropTypes.array,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  navigation: PropTypes.bool,
  pageType: PropTypes.string,
  primaryActions: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.func,
      iconTitle: PropTypes.string,
      title: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      to: PropTypes.string,
      variant: PropTypes.string.isRequired
    }).isRequired
  ),
  title: PropTypes.string
}

export default Page
