import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { snakeCase } from 'lodash-es'
import Badge from 'react-bootstrap/Badge'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownItem from 'react-bootstrap/DropdownItem'
import DropdownMenu from 'react-bootstrap/DropdownMenu'
import DropdownToggle from 'react-bootstrap/DropdownToggle'
import { Link } from 'react-router-dom'

import Button from '@/js/components/Button/Button'
import CustomMenu from '@/js/components/CustomMenu/CustomMenu'
import CustomToggle from '@/js/components/CustomToggle/CustomToggle'
import For from '@/js/components/For/For'
import { Container, Row } from 'react-bootstrap'

/**
 * @typedef {Object} PrimaryAction
 * @property {ReactNode} icon The icon for the action.
 * @property {Boolean} loading Sets the button to the loading state.
 * @property {Boolean} loadingText Sets the button text for the loading state.
 * @property {Function} onClick The onClick callback for the action.
 * @property {String} title The label for the action.
 * @property {String} to The location to be passed to react router.
 * @property {String} variant The Bootstrap variant for the button".
 */

/**
 * @typedef {Object} AdditionalAction
 * @property {String} count The label for the action.
 * @property {Boolean} loading Sets the button to the loading state.
 * @property {Boolean} loadingText Sets the button text for the loading state.
 * @property {Function} onClick The onClick callback for the action.
 * @property {String} to The location to be passed to react router.
 */

/**
 * @typedef {Object} Breadcrumb
 * @property {String} label The label for the header action.
 * @property {String} to The location to be set when clicked.
 * @property {Boolean} active A boolean flag to trigger the active state
 */

/**
 * @typedef {Object} PageHeaderProps
 * @property {AdditionalAction[]} additionalActions An array of objects that configure the additional actions.
 * @property {Breadcrumb[]} breadcrumbs An array of objects that configure the breadcrumbs.
 * @property {String} pageType A string that defines the page type.
 * @property {PrimaryAction[]} primaryActions An array of objects that configure the primary actions.
 * @property {String} title The text for the title.
 * @property {String} titleBadge The text for a title badge.
 */

/*
 * Renders a `PageHeader` component.
 *
 * The component is renders a button, optionally displaying an icon
 *
 * @param {PageHeaderProps} props
 *
 * @component
 * @example <caption>Render a button with an icon</caption>
 * return (
 *   <PageHeader
 *      pageType="primary"
 *      title="This is the page title"
 *   />
 * )
 */
const PageHeader = ({
  additionalActions,
  beforeActions,
  breadcrumbs,
  pageType,
  primaryActions,
  title,
  titleBadge
}) => (
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
    <Container className="mx-0" fluid>
      {
        breadcrumbs.length > 0 && (
          <Row>
            <Col className="p-0">
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
            </Col>
          </Row>
        )
      }
      <Row>
        <Col className="p-0 d-flex">
          <div className="d-flex align-items-center">
            <h2
              className="m-0 text-gray-200 fs-4"
              style={
                {
                  fontWeight: 700,
                  letterSpacing: '-0.015rem'
                }
              }
            >
              {title}
            </h2>
            {titleBadge && <Badge className="ms-2" bg="light-dark text-secondary" size="sm">{titleBadge}</Badge>}
          </div>
          <div className="d-flex flex-row flex-grow-1 justify-content-end ms-4">
            {beforeActions}
            {
              primaryActions && (
                <>
                  <For each={primaryActions}>
                    {
                      (
                        {
                          disabled,
                          disabledTooltipText,
                          icon,
                          iconTitle,
                          loading,
                          loadingText,
                          onClick,
                          title: buttonTitle,
                          to,
                          variant,
                          visible = true
                        }
                      ) => {
                        if (!visible) return null

                        if (to) {
                          return (
                            <div
                              key={buttonTitle}
                              title={disabledTooltipText}
                            >
                              <Button
                                to={to}
                                as={Link}
                                className="ms-2"
                                disabled={disabled}
                                Icon={icon}
                                iconTitle={iconTitle}
                                variant={variant}
                              >
                                {buttonTitle}
                              </Button>
                            </div>
                          )
                        }

                        return (
                          <div
                            key={buttonTitle}
                            title={disabledTooltipText}
                          >
                            <Button
                              className="ms-2"
                              disabled={disabled}
                              Icon={icon}
                              iconTitle={iconTitle}
                              variant={variant}
                              onClick={onClick}
                              loading={loading}
                              loadingText={loadingText}
                            >
                              {buttonTitle}
                            </Button>
                          </div>
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
                                  disabled,
                                  loading: actionLoading,
                                  loadingText: actionLoadingText,
                                  onClick: actionOnClick,
                                  title: actionTitle,
                                  to
                                }
                              ) => {
                                const content = (
                                  <>
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
                                  </>
                                )

                                if (to) {
                                  return (
                                    <DropdownItem
                                      className="d-flex flex-row align-items-center"
                                      key={actionTitle}
                                      eventKey={snakeCase(actionTitle)}
                                      to={to}
                                      as={Link}
                                    >
                                      {content}
                                    </DropdownItem>
                                  )
                                }

                                return (
                                  <DropdownItem
                                    className="d-flex flex-row align-items-center"
                                    key={actionTitle}
                                    eventKey={snakeCase(actionTitle)}
                                    disabled={disabled}
                                    onClick={actionOnClick}
                                    aria-busy={actionLoading}
                                  >
                                    {actionLoading ? actionLoadingText : content}
                                  </DropdownItem>
                                )
                              }

                            }
                          </For>
                        </DropdownMenu>
                      </Dropdown>
                    )
                  }
                </>
              )
            }
          </div>
        </Col>
      </Row>
    </Container>
  </header>
)

PageHeader.defaultProps = {
  beforeActions: null,
  additionalActions: null,
  breadcrumbs: [],
  pageType: 'primary',
  primaryActions: [],
  titleBadge: null
}

PageHeader.propTypes = {
  beforeActions: PropTypes.node,
  additionalActions: PropTypes.arrayOf(
    PropTypes.shape({
      count: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      loading: PropTypes.bool,
      loadingText: PropTypes.string,
      onClick: PropTypes.func,
      title: PropTypes.string.isRequired
    }).isRequired
  ),
  // Disabling the following rule to allow undefined to be passed as a value in the array
  // eslint-disable-next-line react/forbid-prop-types
  breadcrumbs: PropTypes.array,
  pageType: PropTypes.string,
  primaryActions: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.func,
      iconTitle: PropTypes.string,
      loading: PropTypes.bool,
      loadingText: PropTypes.string,
      title: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      to: PropTypes.string,
      variant: PropTypes.string.isRequired
    }).isRequired
  ),
  title: PropTypes.string.isRequired,
  titleBadge: PropTypes.string
}

export default PageHeader
