import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import fetchCmrKeywords from '../../../utils/fetchCmrKeywords'
import DataCenterField from '../DataCenterField'

vi.mock('../../../utils/fetchCmrKeywords')

const providersResponse = {
  short_name: [
    {
      value: 'ASF',
      subfields: ['long_name'],
      long_name: [
        { value: 'Alaska Satellite Facility' }
      ]
    },
    {
      value: 'LARC',
      subfields: ['long_name'],
      long_name: [
        { value: 'Langley Research Center' }
      ]
    }
  ]
}

const setup = (overrideProps = {}) => {
  const onChange = vi.fn()

  fetchCmrKeywords.mockResolvedValue(providersResponse)

  const props = {
    formData: {},
    onChange,
    ...overrideProps
  }

  const user = userEvent.setup()

  const { rerender } = render(
    <DataCenterField {...props} />
  )

  return {
    props,
    user,
    rerender: (newFormData) => {
      rerender(
        <DataCenterField {...props} formData={newFormData} />
      )
    }
  }
}

describe('DataCenterField', () => {
  describe('when formData already exists', () => {
    test('prepopulates with formData and updates when formData changes', async () => {
      const { rerender } = setup({
        formData: {
          ShortName: 'ASF',
          LongName: 'Alaska Satellite Facility'
        }
      })

      await waitFor(() => {
        expect(screen.queryByText('Select Short Name')).not.toBeInTheDocument()
      })

      expect(screen.getByText('ASF')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Alaska Satellite Facility')).toBeInTheDocument()

      rerender({
        ShortName: 'LARC',
        LongName: 'Langley Research Center'
      })

      await waitFor(() => {
        expect(screen.getByText('LARC')).toBeInTheDocument()
      })

      expect(screen.getByDisplayValue('Langley Research Center')).toBeInTheDocument()
      expect(screen.queryByText('ASF')).not.toBeInTheDocument()
    })
  })

  describe('when a user picks a Short Name', () => {
    test('calls onChange with the matching Long Name looked up from CMR', async () => {
      const { user, props } = setup()

      await waitFor(() => {
        expect(screen.getByText('Select Short Name')).toBeInTheDocument()
      })

      const select = screen.getByRole('combobox')
      await user.click(select)

      await user.click(screen.getByText('LARC'))

      expect(props.onChange).toHaveBeenCalledWith({
        ShortName: 'LARC',
        LongName: 'Langley Research Center'
      })
    })
  })

  describe('when a user picks a Short Name with the keyboard instead of a pointer', () => {
    test('calls onChange the same as a pointer pick', async () => {
      const { user, props } = setup()

      await waitFor(() => {
        expect(screen.getByText('Select Short Name')).toBeInTheDocument()
      })

      const select = screen.getByRole('combobox')
      await user.click(select)

      // The custom Option's onMouseDown (used for a pointer pick) never fires for a keyboard
      // selection -- react-select handles arrow keys/Enter itself, independently of Option's
      // own rendering, and calls the Select's onChange directly. Index 0 is the blank "Clear
      // Short Name" entry, so two ArrowDowns reach the first real option (ASF).
      await user.keyboard('{ArrowDown}{ArrowDown}{Enter}')

      expect(props.onChange).toHaveBeenCalledWith({
        ShortName: 'ASF',
        LongName: 'Alaska Satellite Facility'
      })
    })
  })

  describe('when fetchCmrKeywords resolves to null (its own swallowed fetch failure)', () => {
    test('finishes loading instead of hanging, with no options to pick', async () => {
      const onChange = vi.fn()
      fetchCmrKeywords.mockResolvedValue(null)

      const { container } = render(<DataCenterField formData={{}} onChange={onChange} />)

      // GetKeywords would otherwise throw destructuring a null response, leaving `loading`
      // stuck true forever -- react-select's own isLoading spinner, which has no accessible
      // role/text of its own to query for -- instead of settling to false once the
      // (already-swallowed) fetch failure comes back.
      await waitFor(() => {
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        expect(container.querySelector('[class*="loadingIndicator"]')).not.toBeInTheDocument()
      })

      const user = userEvent.setup()
      await user.click(screen.getByRole('combobox'))

      expect(await screen.findByText('Clear Short Name')).toBeInTheDocument()
      expect(screen.queryByText('ASF')).not.toBeInTheDocument()
    })

    test('selecting the blank option via the keyboard calls onChange instead of crashing', async () => {
      const onChange = vi.fn()
      fetchCmrKeywords.mockResolvedValue(null)

      render(<DataCenterField formData={{}} onChange={onChange} />)

      const user = userEvent.setup()
      const select = screen.getByRole('combobox')
      await user.click(select)

      // With providersResponse still null (the fetch never succeeded), selectShortName's own
      // getKeywords lookup would throw destructuring it -- onHandleChange has to route this
      // blank selection through onHandleClear instead, which never touches providersResponse.
      await user.keyboard('{ArrowDown}{Enter}')

      expect(onChange).toHaveBeenCalledWith({
        ShortName: '',
        LongName: ''
      })
    })
  })

  describe('when a user selects the clear option', () => {
    test('calls onChange with empty values', async () => {
      const { user, props } = setup({
        formData: {
          ShortName: 'ASF',
          LongName: 'Alaska Satellite Facility'
        }
      })

      await waitFor(() => {
        expect(screen.getByText('ASF')).toBeInTheDocument()
      })

      const select = screen.getByRole('combobox')
      await user.click(select)
      await user.click(screen.getByText('Clear Short Name'))

      expect(props.onChange).toHaveBeenCalledWith({
        ShortName: '',
        LongName: ''
      })
    })
  })
})
