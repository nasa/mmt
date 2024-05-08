import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { snakeCase } from 'lodash-es'
import Badge from 'react-bootstrap/Badge'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownItem from 'react-bootstrap/DropdownItem'
import DropdownMenu from 'react-bootstrap/DropdownMenu'
import DropdownToggle from 'react-bootstrap/DropdownToggle'
import { Link } from 'react-router-dom'

import Button from '../Button/Button'
import CustomMenu from '../CustomMenu/CustomMenu'
import CustomToggle from '../CustomToggle/CustomToggle'
import For from '../For/For'

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

const PageHeader = ({
  additionalActions,
  breadcrumbs,
  pageType,
  primaryActions,
  title
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
                    disabled,
                    disabledTooltipText,
                    icon,
                    iconTitle,
                    loading,
                    loadingText,
                    onClick,
                    title: buttonTitle,
                    to,
                    variant
                  }
                ) => {
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
                          size="sm"
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
                        size="sm"
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
          </div>
        )
      }
    </div>
  </header>
)

PageHeader.defaultProps = {
  additionalActions: null,
  breadcrumbs: [],
  pageType: 'primary',
  primaryActions: []
}

PageHeader.propTypes = {
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
  title: PropTypes.string.isRequired
}

export default PageHeader
