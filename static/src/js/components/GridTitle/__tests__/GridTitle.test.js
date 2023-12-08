import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import GridTitle from '../GridTitle'

const setup = (overrideProps = {}) => {
  const formContext = {
  }

  const props = {
    title: 'The title',
    groupClassName: 'group-class-name',
    groupBoxClassName: 'group-box-class-name',
    required: false,
    registry: {
      formContext,
      fields: {
        TitleField: () => (<div>the mock title</div>)
      }
    },
    id: 'unique-id',
    ...overrideProps
  }

  render(
    <GridTitle {...props} />
  )

  return {
    props,
    user: userEvent.setup()
  }
}

describe('GridTitle', () => {
  describe('when there is a TitleField registered', () => {
    test('renders the mock title', () => {
      setup()
      expect(screen.queryByText('mock title field')).not.toBeInTheDocument()
    })

    test('verifies props passed in', () => {
      const { props } = setup({
        registry: {
          formContext: {},
          fields: {
            TitleField: jest.fn()
          }
        }

      })
      expect(props.registry.fields.TitleField).toBeCalledTimes(1)
      expect(props.registry.fields.TitleField).toBeCalledWith({
        className: 'group-class-name',
        disabled: false,
        groupBoxClassName: 'group-box-class-name',
        id: 'unique-id',
        idSchema: undefined,
        name: 'The title',
        onBlur: undefined,
        onChange: undefined,
        onFocus: undefined,
        options: undefined,
        readonly: false,
        registry: props.registry,
        required: false,
        schema: undefined,
        title: 'The title'
      }, {})
    })
  })

  describe('when there is no TitleField registered', () => {
    test('renders nothing', () => {
      setup({
        registry: {
          formContext: {},
          fields: {
          }
        }
      })

      expect(screen.queryByText('mock title field')).not.toBeInTheDocument()
    })
  })
})
