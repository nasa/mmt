import React from 'react'
import PropTypes from 'prop-types'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import BulkActionsControlledValuePicker from '../BulkActionsControlledValuePicker'

import KeywordPicker from '../../KeywordPicker/KeywordPicker'

// A single new keyword to "pick" -- used to test both multi-value (appends) and single-value
// (replaces) behavior through the same stub, since that's the only thing that differs now.
const PICKED_KEYWORD = {
  Category: 'EARTH SCIENCE',
  Topic: 'ATMOSPHERE'
}

vi.mock('../../KeywordPicker/KeywordPicker', () => ({
  __esModule: true,
  default: vi.fn(({ formData, onChange, uiSchema }) => (
    <div>
      <span>{`KeywordPicker scheme_values=${uiSchema['ui:scheme_values'].join(',')}`}</span>
      <span>{`KeywordPicker add_button_label=${uiSchema['ui:add_button_label']}`}</span>
      <span>{`formData=${JSON.stringify(formData)}`}</span>
      <button type="button" onClick={() => onChange([...formData, PICKED_KEYWORD])}>
        pick keyword
      </button>
    </div>
  ))
}))

const PICKED_PLATFORM = {
  Type: 'Jet',
  ShortName: 'A340-600',
  LongName: 'Airbus A340-600'
}

vi.mock('../../PlatformField/PlatformField', () => ({
  __esModule: true,
  default: vi.fn(({ formData, onChange }) => (
    <div>
      <span>{`PlatformField formData=${JSON.stringify(formData)}`}</span>
      <button type="button" onClick={() => onChange(PICKED_PLATFORM)}>
        pick platform
      </button>
    </div>
  ))
}))

const PICKED_INSTRUMENT = {
  ShortName: 'ATM',
  LongName: 'Airborne Topographic Mapper'
}

vi.mock('../../InstrumentField/InstrumentField', () => ({
  __esModule: true,
  default: vi.fn(({ formData, onChange }) => (
    <div>
      <span>{`InstrumentField formData=${JSON.stringify(formData)}`}</span>
      <button type="button" onClick={() => onChange(PICKED_INSTRUMENT)}>
        pick instrument
      </button>
    </div>
  ))
}))

const PICKED_DATA_CENTER = {
  ShortName: 'ASF',
  LongName: 'Alaska Satellite Facility'
}

vi.mock('../../DataCenterField/DataCenterField', () => ({
  __esModule: true,
  default: vi.fn(({ formData, onChange }) => (
    <div>
      <span>{`DataCenterField formData=${JSON.stringify(formData)}`}</span>
      <button type="button" onClick={() => onChange(PICKED_DATA_CENTER)}>
        pick data center
      </button>
    </div>
  ))
}))

// BulkActionsControlledEntryList itself is unit-tested on its own (the Add/remove/pending
// chrome) -- here it's a thin stub that (a) renders the real single-entry field it was given
// via `renderPicker`, so the Platforms/Instruments/Data Centers describe blocks below can
// confirm each field gets wired to the right one, and (b) exposes a single "add entry" button
// that appends whatever that field "picked" straight onto `entries`, so the multi- vs
// single-value replace behavior can be exercised without re-testing the entry list itself.
vi.mock('../../BulkActionsControlledEntryList/BulkActionsControlledEntryList', () => ({
  __esModule: true,
  default: vi.fn(({
    entries, onChange, entryKeys, renderPicker, addButtonLabel
  }) => {
    let picked = {}

    return (
      <div>
        <span>{`BulkActionsControlledEntryList entryKeys=${entryKeys.join(',')}`}</span>
        <span>{`BulkActionsControlledEntryList addButtonLabel=${addButtonLabel}`}</span>
        <span>{`entries=${JSON.stringify(entries)}`}</span>
        {
          renderPicker({
            formData: {},
            onChange: (next) => { picked = next }
          })
        }
        <button type="button" onClick={() => onChange([...entries, picked])}>
          add entry
        </button>
      </div>
    )
  })
}))

const scienceKeywordsFieldConfig = {
  value: 'SCIENCE_KEYWORDS',
  updateValueFields: [
    {
      key: 'Category',
      type: 'text'
    },
    {
      key: 'Topic',
      type: 'text'
    },
    {
      key: 'Term',
      type: 'text'
    }
  ]
}

const platformsFieldConfig = {
  value: 'PLATFORMS',
  updateValueFields: [
    {
      key: 'Type',
      type: 'text'
    },
    {
      key: 'ShortName',
      type: 'text'
    },
    {
      key: 'LongName',
      type: 'text'
    },
    {
      key: 'Characteristics',
      type: 'nested-array',
      fields: []
    }
  ]
}

const instrumentsFieldConfig = {
  value: 'INSTRUMENTS',
  updateValueFields: [
    {
      key: 'ShortName',
      type: 'text'
    },
    {
      key: 'LongName',
      type: 'text'
    },
    {
      key: 'Technique',
      type: 'text'
    },
    {
      key: 'NumberOfInstruments',
      type: 'number'
    }
  ]
}

const dataCentersFieldConfig = {
  value: 'DATA_CENTERS',
  updateValueFields: [
    {
      key: 'ShortName',
      type: 'text'
    },
    {
      key: 'LongName',
      type: 'text'
    },
    {
      key: 'Roles',
      type: 'multiselect',
      options: ['ARCHIVER']
    }
  ]
}

// A stateful wrapper, since the picker is fully controlled by `value`.
const Wrapper = ({
  fieldConfig, allowMultiple, initialValue, onChange
}) => {
  const [value, setValue] = React.useState(initialValue)

  return (
    <BulkActionsControlledValuePicker
      fieldConfig={fieldConfig}
      allowMultiple={allowMultiple}
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
  fieldConfig: PropTypes.shape({}).isRequired,
  allowMultiple: PropTypes.bool.isRequired,
  initialValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

const setup = ({
  fieldConfig,
  allowMultiple = false,
  value = '{}'
}) => {
  const onChange = vi.fn()
  const user = userEvent.setup()

  render(
    <Wrapper
      fieldConfig={fieldConfig}
      allowMultiple={allowMultiple}
      initialValue={value}
      onChange={onChange}
    />
  )

  return {
    onChange,
    user
  }
}

describe('BulkActionsControlledValuePicker', () => {
  describe('when the current JSON is invalid', () => {
    test('shows a note instead of a picker', () => {
      setup({
        fieldConfig: scienceKeywordsFieldConfig,
        value: '{not valid'
      })

      expect(screen.getByText('Fix the JSON below to use the picker.')).toBeInTheDocument()
      expect(KeywordPicker).not.toHaveBeenCalled()
    })
  })

  describe('Science Keywords', () => {
    describe('when the action type supports multiple entries', () => {
      test('renders KeywordPicker scoped to this field\'s updateValueFields and writes an array back', async () => {
        const { onChange, user } = setup({
          fieldConfig: scienceKeywordsFieldConfig,
          allowMultiple: true,
          value: '[]'
        })

        expect(screen.getByText('KeywordPicker scheme_values=Category,Topic,Term')).toBeInTheDocument()
        expect(screen.getByText('KeywordPicker add_button_label=Add Keyword')).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'pick keyword' }))

        expect(onChange).toHaveBeenCalledWith(JSON.stringify([PICKED_KEYWORD], null, 2))
      })
    })

    describe('when the action type only accepts a single entry', () => {
      test('labels the submit button "Select Keyword" instead of "Add Keyword"', () => {
        setup({
          fieldConfig: scienceKeywordsFieldConfig,
          allowMultiple: false,
          value: '{}'
        })

        expect(screen.getByText('KeywordPicker add_button_label=Select Keyword')).toBeInTheDocument()
      })

      test('picking a keyword from empty writes it as a flat object, not an array', async () => {
        const { onChange, user } = setup({
          fieldConfig: scienceKeywordsFieldConfig,
          allowMultiple: false,
          value: '{}'
        })

        await user.click(screen.getByRole('button', { name: 'pick keyword' }))

        expect(onChange).toHaveBeenCalledWith(JSON.stringify(PICKED_KEYWORD, null, 2))
      })

      test('picking again replaces the previous pick instead of adding to it', async () => {
        const { onChange, user } = setup({
          fieldConfig: scienceKeywordsFieldConfig,
          allowMultiple: false,
          value: JSON.stringify({
            Category: 'OCEANS',
            Topic: 'OCEAN TEMPERATURE',
            Term: 'SEA SURFACE TEMPERATURE'
          })
        })

        // The already-picked OCEANS keyword is shown as the sole existing entry.
        expect(screen.getByText('formData=[{"Category":"OCEANS","Topic":"OCEAN TEMPERATURE","Term":"SEA SURFACE TEMPERATURE"}]')).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'pick keyword' }))

        // Only the newest pick survives -- the previous OCEANS selection is gone.
        expect(onChange).toHaveBeenCalledWith(JSON.stringify(PICKED_KEYWORD, null, 2))
      })
    })
  })

  describe.each([
    ['Platforms', platformsFieldConfig, 'PlatformField', 'pick platform', PICKED_PLATFORM, 'ShortName,Type,LongName'],
    ['Instruments', instrumentsFieldConfig, 'InstrumentField', 'pick instrument', PICKED_INSTRUMENT, 'ShortName,LongName,Technique,NumberOfInstruments'],
    ['Data Centers', dataCentersFieldConfig, 'DataCenterField', 'pick data center', PICKED_DATA_CENTER, 'ShortName,LongName,Roles']
  ])('%s', (label, fieldConfig, fieldComponentName, pickButtonName, pickedEntry, pickedKeys) => {
    test(`renders ${fieldComponentName} via BulkActionsControlledEntryList, scoped to its own keys`, () => {
      setup({
        fieldConfig,
        allowMultiple: true,
        value: '[]'
      })

      expect(screen.getByText(`BulkActionsControlledEntryList entryKeys=${pickedKeys}`)).toBeInTheDocument()
      expect(screen.getByText(new RegExp(`^${fieldComponentName} formData=`))).toBeInTheDocument()
    })

    describe('when the action type supports multiple entries', () => {
      test('labels the submit button "Add"', () => {
        setup({
          fieldConfig,
          allowMultiple: true,
          value: '[]'
        })

        expect(screen.getByText('BulkActionsControlledEntryList addButtonLabel=Add')).toBeInTheDocument()
      })

      test('appends the pick to the list', async () => {
        const { onChange, user } = setup({
          fieldConfig,
          allowMultiple: true,
          value: '[]'
        })

        await user.click(screen.getByRole('button', { name: pickButtonName }))
        await user.click(screen.getByRole('button', { name: 'add entry' }))

        expect(onChange).toHaveBeenCalledWith(JSON.stringify([pickedEntry], null, 2))
      })
    })

    describe('when the action type only accepts a single entry', () => {
      test('labels the submit button "Select" instead of "Add"', () => {
        setup({
          fieldConfig,
          allowMultiple: false,
          value: '{}'
        })

        expect(screen.getByText('BulkActionsControlledEntryList addButtonLabel=Select')).toBeInTheDocument()
      })

      test('picking again replaces the previous pick, and an unrelated key survives untouched', async () => {
        const ownKeys = new Set(pickedKeys.split(','))

        // Characteristics/Roles are "unrelated" only for a row whose picker doesn't own them --
        // Data Centers' Roles is one of its own pickedKeys, so it's excluded here and expected
        // to be cleared by the pick below instead of surviving untouched.
        const unrelated = Object.fromEntries(
          Object.entries({
            Characteristics: [{ Name: 'foo' }],
            Roles: ['ARCHIVER']
          }).filter(([key]) => !ownKeys.has(key))
        )

        const { onChange, user } = setup({
          fieldConfig,
          allowMultiple: false,
          value: JSON.stringify({
            ...unrelated,
            ShortName: 'STALE'
          })
        })

        await user.click(screen.getByRole('button', { name: pickButtonName }))
        await user.click(screen.getByRole('button', { name: 'add entry' }))

        // The picked fields come back in `pickedKeys` order (the field's canonical order),
        // not whatever order the picker component's own onChange happened to produce.
        const orderedPick = {}
        pickedKeys.split(',').forEach((key) => { orderedPick[key] = pickedEntry[key] })

        expect(onChange).toHaveBeenCalledWith(JSON.stringify({
          ...unrelated,
          ...orderedPick
        }, null, 2))
      })
    })
  })

  describe('when the field has no controlled picker configured', () => {
    test('renders nothing', () => {
      const { container } = render(
        <BulkActionsControlledValuePicker
          fieldConfig={
            {
              value: 'UNKNOWN_FIELD',
              updateValueFields: []
            }
          }
          allowMultiple={false}
          value="{}"
          onChange={vi.fn()}
        />
      )

      expect(container).toBeEmptyDOMElement()
    })
  })
})
