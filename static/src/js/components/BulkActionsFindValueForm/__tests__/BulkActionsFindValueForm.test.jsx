import React, { useState } from 'react'
import PropTypes from 'prop-types'
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

// A stateful wrapper, since a controlled input whose value prop never updates can't
// actually be typed into character-by-character (needed for multi-character values below).
const Wrapper = ({ initialValue, onChange }) => {
  const [value, setValue] = useState(initialValue)

  return (
    <BulkActionsFindValueForm
      flatFindKeys={flatFindKeys}
      value={value}
      onChange={
        (nextValue) => {
          setValue(nextValue)
          onChange(nextValue)
        }
      }
    />
  )
}

Wrapper.propTypes = {
  initialValue: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired
}

const setup = ({ value = {}, onChange = vi.fn() } = {}) => {
  const user = userEvent.setup()

  render(<Wrapper initialValue={value} onChange={onChange} />)

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

  test('keeps a number-type field as the raw typed string, uncoerced', async () => {
    const { onChange, user } = setup()

    await user.type(screen.getByLabelText('NumberOfInstruments'), '5')

    expect(onChange).toHaveBeenLastCalledWith({ NumberOfInstruments: '5' })
  })

  test('keeps an invalid number-type value visible instead of deleting it', async () => {
    const { onChange, user } = setup()

    await user.type(screen.getByLabelText('NumberOfInstruments'), '2.5')

    expect(onChange).toHaveBeenLastCalledWith({ NumberOfInstruments: '2.5' })
    expect(screen.getByLabelText('NumberOfInstruments')).toHaveValue(2.5)
  })

  describe('when a key is flagged freeText', () => {
    const freeTextKeys = [
      {
        key: 'Category',
        type: 'text'
      },
      {
        key: 'DetailedVariable',
        type: 'text',
        freeText: true
      }
    ]

    const setupFreeText = () => {
      const onChange = vi.fn()

      render(
        <BulkActionsFindValueForm
          flatFindKeys={freeTextKeys}
          value={{}}
          onChange={onChange}
        />
      )

      return { onChange }
    }

    test('renders it in its own "Additional Free-Text Criteria" subsection below the others', () => {
      setupFreeText()

      const heading = screen.getByText('Additional Free-Text Criteria')
      const categoryInput = screen.getByLabelText('Category')
      const detailedVariableInput = screen.getByLabelText('DetailedVariable')

      expect(heading).toBeInTheDocument()
      expect(categoryInput.compareDocumentPosition(heading))
        .toBe(Node.DOCUMENT_POSITION_FOLLOWING)

      expect(heading.compareDocumentPosition(detailedVariableInput))
        .toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    })

    test('does not render the subsection heading when no key is flagged freeText', () => {
      setup()

      expect(screen.queryByText('Additional Free-Text Criteria')).not.toBeInTheDocument()
    })
  })
})
