import React from 'react'
import {
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import parseCmrInstrumentsResponse from '../../../utils/parseCmrInstrumentsResponse'
import fetchCmrKeywords from '../../../utils/fetchCmrKeywords'
import InstrumentField from '../InstrumentField'

vi.mock('../../../utils/parseCmrInstrumentsResponse')
vi.mock('../../../utils/fetchCmrKeywords')

const setup = (overrideProps = {}) => {
  const onChange = vi.fn()

  const formContext = {
    focusField: '',
    setFocusField: vi.fn()
  }

  fetchCmrKeywords.mockReturnValue({
    category: [{
      value: 'Earth Remote Sensing Instruments',
      subfields: ['class'],
      class: [{
        value: 'Active Remote Sensing',
        subfields: ['type'],
        type: [{
          value: 'Profilers/Sounders',
          subfields: ['subtype'],
          subtype: [{
            value: 'Acoustic Sounders',
            subfields: ['short_name'],
            short_name: [{
              value: 'ACOUSTIC SOUNDERS',
              uuid: '7ef0c3e6-1012-411a-b166-482fb35bb1dd'
            }]
          }]
        }, {
          value: 'Altimeters',
          subfields: ['subtype'],
          subtype: [{
            value: 'Lidar/Laser Altimeters',
            subfields: ['short_name'],
            short_name: [{
              value: 'ATM',
              subfields: ['long_name'],
              long_name: [{
                value: 'Airborne Topographic Mapper',
                uuid: 'c2428a35-a87c-4ec7-aefd-13ff410b3271'
              }]
            }, {
              value: 'LVIS',
              subfields: ['long_name'],
              long_name: [{
                value: 'Land, Vegetation, and Ice Sensor',
                uuid: 'aa338429-35e6-4ee2-821f-0eac81802689'
              }]
            }]
          }]
        }]
      }, {
        value: 'Passive Remote Sensing',
        subfields: ['type'],
        type: [{
          value: 'Spectrometers/Radiometers',
          subfields: ['subtype'],
          subtype: [{
            value: 'Imaging Spectrometers/Radiometers',
            subfields: ['short_name'],
            short_name: [{
              value: 'SMAP L-BAND RADIOMETER',
              subfields: ['long_name'],
              long_name: [{
                value: 'SMAP L-Band Radiometer',
                uuid: 'fee5e9e1-10f1-4f14-94bc-c287f8e2c209'
              }]
            }]
          }]
        }]
      }]
    }, {
      value: 'In Situ/Laboratory Instruments',
      subfields: ['class'],
      class: [{
        value: 'Chemical Meters/Analyzers',
        subfields: ['short_name'],
        short_name: [{
          value: 'ADS',
          subfields: ['long_name'],
          long_name: [{
            value: 'Automated DNA Sequencer',
            uuid: '554a3c73-3b48-43ea-bf5b-8b98bc2b11bc'
          }]
        }]
      }]
    }]
  })

  parseCmrInstrumentsResponse.mockReturnValue([
    {
      category: 'Earth Remote Sensing Instruments',
      class: 'Active Remote Sensing',
      type: 'Altimeters',
      subtype: 'Lidar/Laser Altimeters',
      short_name: 'ATM',
      long_name: 'Airborne Topographic Mapper'
    },
    {
      category: 'Earth Remote Sensing Instruments',
      class: 'Active Remote Sensing',
      type: 'Altimeters',
      subtype: 'Lidar/Laser Altimeters',
      short_name: 'LVIS',
      long_name: 'Land, Vegetation, and Ice Sensor'
    },
    {
      category: 'Earth Remote Sensing Instruments',
      class: 'Active Remote Sensing',
      type: 'Profilers/Sounders',
      subtype: 'Acoustic Sounders',
      short_name: 'ACOUSTIC SOUNDERS'
    },
    {
      category: 'Earth Remote Sensing Instruments',
      class: 'Passive Remote Sensing',
      type: 'Spectrometers/Radiometers',
      subtype: 'Imaging Spectrometers/Radiometers',
      short_name: 'SMAP L-BAND RADIOMETER',
      long_name: 'SMAP L-Band Radiometer'
    },
    {
      category: 'In Situ/Laboratory Instruments',
      class: 'Chemical Meters/Analyzers',
      short_name: 'ADS',
      long_name: 'Automated DNA Sequencer'
    },
    {
      category: 'In Situ/Laboratory Instruments',
      class: 'Chemical Meters/Analyzers',
      type: 'Analyzers Type',
      short_name: 'ADS For Type',
      long_name: 'Automated DNA Sequencer For Type'
    }
  ])

  const uiSchema = {
    'ui:controlled': {
      name: 'instruments',
      controlName: ['category', 'class', 'type', 'subtype', 'short_name', 'long_name']
    }
  }

  const props = {
    formData: {},
    onChange,
    registry: {
      formContext
    },
    uiSchema,
    ...overrideProps
  }

  const user = userEvent.setup()

  render(
    <InstrumentField {...props} />
  )

  return {
    props,
    user
  }
}

describe('Instrument Field', () => {
  describe('when a user clicks clicks the down arrow on Short Name', () => {
    test('renders a list of clickable cmr keywords', async () => {
      const { user } = setup()

      expect(screen.getByText('Select Short Name')).toBeInTheDocument()

      const select = screen.getByRole('combobox')
      await user.click(select)

      expect(screen.getByText('Altimeters>Lidar/Laser Altimeters').className).toContain('instrument-field-select-title')
      expect(screen.getByText('LVIS').className).toContain('instrument-field-select-option')

      await user.click(screen.getByText('LVIS'))

      expect(screen.getByDisplayValue('Land, Vegetation, and Ice Sensor')).toBeInTheDocument()
    })
  })

  describe('when a user clicks clicks the down arrow on Short Name', () => {
    test('Title display for existing Type without Subtype', async () => {
      const { user } = setup()

      expect(screen.getByText('Select Short Name')).toBeInTheDocument()

      const select = screen.getByRole('combobox')
      await user.click(select)

      expect(screen.getByText('Analyzers Type').className).toContain('instrument-field-select-title')
      expect(screen.getByText('ADS For Type').className).toContain('instrument-field-select-option')

      await user.click(screen.getByText('ADS For Type'))

      expect(screen.getByDisplayValue('Automated DNA Sequencer For Type')).toBeInTheDocument()
    })
  })

  describe('when a user selects the clear option', () => {
    test('the state is cleared', async () => {
      const { user } = setup({
        formData: {
          ShortName: 'ACOUSTIC SOUNDERS'
        }
      })

      expect(screen.getByText('ACOUSTIC SOUNDERS')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('No available Long Name')).toBeInTheDocument()

      const select = screen.getByRole('combobox')
      await user.click(select)
      await user.click(screen.getByText('Clear Short Name'))

      expect(screen.getByText('Select Short Name')).toBeInTheDocument()
    })
  })

  describe('when a user clicks away from the menu', () => {
    test('the screen blurs', async () => {
      const { user } = setup()

      const select = screen.getByRole('combobox')
      await user.click(select)

      const blurClick = (screen.getAllByRole('textbox'))
      await user.click(blurClick[0])

      expect(screen.getByText('Select Short Name')).toBeInTheDocument()
    })
  })

  describe('when a user hover over an entry', () => {
    test('the tooltip shows up', async () => {
      const { user } = setup()

      const select = screen.getByRole('combobox')
      await user.click(select)

      await user.hover(screen.getByText('ACOUSTIC SOUNDERS'))
      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip')
        expect(within(tooltip).getByText('Profilers/Sounders>Acoustic Sounders')).toBeInTheDocument()
      })
    })
  })

  describe('when a user selects an option with no longName', () => {
    test('the screen blurs', async () => {
      const { user } = setup()

      const select = screen.getByRole('combobox')
      await user.click(select)

      await user.click(screen.getByText('ACOUSTIC SOUNDERS'))
    })
  })
})
