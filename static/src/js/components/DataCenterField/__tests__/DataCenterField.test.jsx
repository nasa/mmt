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
