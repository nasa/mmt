import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import BulkActionsFindValueForm from '../BulkActionsFindValueForm'

const flatFindKeys = [
  {
    key: 'ShortName',
    type: 'text'
  },
  {
    key: 'LongName',
    type: 'text'
  },
  {
    key: 'NumberOfInstruments',
    type: 'number'
  }
]

const setup = ({ value = {}, onChange = vi.fn() } = {}) => {
  const user = userEvent.setup()

  render(
    <BulkActionsFindValueForm
      flatFindKeys={flatFindKeys}
      value={value}
      onChange={onChange}
    />
  )

  return {
    onChange,
    user
  }
}

describe('BulkActionsFindValueForm component', () => {
  test('renders a text input per flat find key', () => {
    setup()

    expect(screen.getByLabelText('ShortName')).toBeInTheDocument()
    expect(screen.getByLabelText('LongName')).toBeInTheDocument()
  })

  test('calls onChange with the key set when a field is typed into', async () => {
    const { onChange, user } = setup()

    await user.type(screen.getByLabelText('ShortName'), 'X')

    expect(onChange).toHaveBeenCalledWith({ ShortName: 'X' })
  })

  test('calls onChange with the key removed when a field is cleared', async () => {
    const { onChange, user } = setup({ value: { ShortName: 'X' } })

    await user.clear(screen.getByLabelText('ShortName'))

    expect(onChange).toHaveBeenCalledWith({})
  })

  test('coerces a number-type field to a real number instead of a string', async () => {
    const { onChange, user } = setup()

    await user.type(screen.getByLabelText('NumberOfInstruments'), '5')

    expect(onChange).toHaveBeenLastCalledWith({ NumberOfInstruments: 5 })
  })
})
