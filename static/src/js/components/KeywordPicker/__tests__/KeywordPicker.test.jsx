import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { test } from 'vitest'
import useControlledKeywords from '../../../hooks/useControlledKeywords'

import parseCmrResponse from '../../../utils/parseCmrResponse'

import KeywordPicker from '../KeywordPicker'
import KeywordRecommendations from '../../KeywordRecommendations/KeywordRecommendations'

vi.mock('../../KeywordRecommendations/KeywordRecommendations')
vi.mock('../../../hooks/useControlledKeywords')
vi.mock('../../../utils/parseCmrResponse')

const setup = (overrideProps = {}, includeRecommendedKeywords = false) => {
  const onChange = vi.fn()

  useControlledKeywords.mockReturnValue({
    keywords: [
      {
        category: [
          {
            value: 'EARTH SCIENCE SERVICES',
            subfields: [
              'topic'
            ],
            topic: [
              {
                value: 'DATA ANALYSIS AND VISUALIZATION',
                subfields: [
                  'term'
                ],
                term: [
                  {
                    value: 'CALIBRATION/VALIDATION',
                    uuid: '4f938731-d686-4d89-b72b-ff60474bb1f0'
                  },
                  {
                    value: 'GEOGRAPHIC INFORMATION SYSTEMS',
                    uuid: '794e3c3b-791f-44de-9ff3-358d8ed74733',
                    subfields: [
                      'variable_level_1'
                    ],
                    variable_level_1: [
                      {
                        value: 'MOBILE GEOGRAPHIC INFORMATION SYSTEMS',
                        uuid: '0dd83b2a-e83f-4a0c-a1ff-2fbdbbcce62d'
                      },
                      {
                        value: 'DESKTOP GEOGRAPHIC INFORMATION SYSTEMS',
                        uuid: '565cb301-44de-446c-8fe3-4b5cce428315'
                      }
                    ]
                  }
                ]
              },
              {
                value: 'DATA MANAGEMENT/DATA HANDLING',
                subfields: [
                  'term'
                ],
                term: [
                  {
                    value: 'CATALOGING',
                    uuid: '434d40e2-4e0b-408a-9811-ff878f4f0fb0'
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    isLoading: false
  })

  parseCmrResponse.mockReturnValue([
    [
      'TOOL KEYWORD',
      'EARTH SCIENCE SERVICES',
      'DATA ANALYSIS AND VISUALIZATION',
      'CALIBRATION/VALIDATION'
    ],
    [
      'TOOL KEYWORD',
      'EARTH SCIENCE SERVICES',
      'DATA ANALYSIS AND VISUALIZATION',
      'GEOGRAPHIC INFORMATION SYSTEMS',
      'DESKTOP GEOGRAPHIC INFORMATION SYSTEMS'
    ],
    [
      'TOOL KEYWORD',
      'EARTH SCIENCE SERVICES',
      'DATA ANALYSIS AND VISUALIZATION',
      'GEOGRAPHIC INFORMATION SYSTEMS',
      'MOBILE GEOGRAPHIC INFORMATION SYSTEMS'
    ],
    [
      'TOOL KEYWORD',
      'EARTH SCIENCE SERVICES',
      'DATA MANAGEMENT/DATA HANDLING',
      'CATALOGING'
    ]
  ])

  const schema = {
    description: 'Allows for the specification of Earth Science keywords that are representative of the service, software, or tool being described. The controlled vocabulary for Science Keywords is maintained in the Keyword Management System (KMS).',
    type: 'array',
    items: {
      type: 'object',
      additionalProperties: false,
      description: 'Enables specification of Earth science tool keywords related to the tool.  The Earth Science Tool keywords are chosen from a controlled keyword hierarchy maintained in the Keyword Management System (KMS).',
      properties: {
        ToolCategory: {
          type: 'string',
          minLength: 1,
          maxLength: 80,
          pattern: "[\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=,][\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=, ]{1,79}"
        },
        ToolTopic: {
          type: 'string',
          minLength: 1,
          maxLength: 80,
          pattern: "[\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=,][\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=, ]{1,79}"
        },
        ToolTerm: {
          type: 'string',
          minLength: 1,
          maxLength: 80,
          pattern: "[\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=,][\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=, ]{1,79}"
        },
        ToolSpecificTerm: {
          type: 'string',
          minLength: 1,
          maxLength: 80,
          pattern: "[\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=,][\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=, ]{1,79}"
        }
      },
      required: [
        'ToolCategory',
        'ToolTopic'
      ]
    },
    minItems: 1
  }

  const uiSchema = {
    'ui:field': 'keywordPicker',
    'ui:filter': 'EARTH SCIENCE SERVICES',
    'ui:keyword_scheme': 'science_keywords',
    'ui:keyword_scheme_column_names': ['toolkeywords', 'category', 'topic', 'term', 'variable_level_1', 'variable_level_2', 'variable_level_3'],
    'ui:picker_title': 'TOOL KEYWORD',
    'ui:scheme_values': ['ToolCategory', 'ToolTopic', 'ToolTerm', 'ToolSpecificTerm'],
    'ui:title': 'Tool Keyword',
    'ui:includeRecommendedKeywords': includeRecommendedKeywords,
    'ui:selectable_parents': true
  }
  const props = {
    formData: [],
    onChange,
    required: false,
    schema,
    uiSchema,
    ...overrideProps
  }

  const user = userEvent.setup()

  const { rerender } = render(
    <KeywordPicker {...props} />
  )

  return {
    props,
    user,
    rerenderWithUiSchema: (nextUiSchema) => rerender(
      <KeywordPicker {...props} uiSchema={nextUiSchema} />
    )
  }
}

describe('KeywordPicker', () => {
  describe('when the picker is required', () => {
    test('renders the picker with a required icon', () => {
      setup({
        required: true
      })

      expect(screen.getByText('EARTH SCIENCE SERVICES')).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'Required' })).toBeInTheDocument()
    })
  })

  describe('submit button label', () => {
    test('defaults to "Add Keyword"', () => {
      setup({})

      expect(screen.getByRole('button', { name: 'add' })).toHaveTextContent('Add Keyword')
    })

    test('uses ui:add_button_label when provided', () => {
      setup({
        uiSchema: {
          'ui:field': 'keywordPicker',
          'ui:filter': 'EARTH SCIENCE SERVICES',
          'ui:keyword_scheme': 'science_keywords',
          'ui:keyword_scheme_column_names': ['toolkeywords', 'category', 'topic', 'term', 'variable_level_1', 'variable_level_2', 'variable_level_3'],
          'ui:picker_title': 'TOOL KEYWORD',
          'ui:scheme_values': ['ToolCategory', 'ToolTopic', 'ToolTerm', 'ToolSpecificTerm'],
          'ui:title': 'Tool Keyword',
          'ui:add_button_label': 'Select Keyword'
        }
      })

      expect(screen.getByRole('button', { name: 'add' })).toHaveTextContent('Select Keyword')
    })
  })

  describe('when adding a keyword', () => {
    describe('when the selected keyword is not already added', () => {
      test('adds the selected keyword', async () => {
        const { props, user } = setup({})

        // Navigating into the first parent level (View, not the select option itself)
        const earthScienceServiceNav = screen.getByRole('link', { name: 'View EARTH SCIENCE SERVICES' })
        await user.click(earthScienceServiceNav)

        // Navigating into the second parent level
        const dataAnalysisNav = screen.getByRole('link', { name: 'View DATA ANALYSIS AND VISUALIZATION' })
        await user.click(dataAnalysisNav)

        // Selecting the leaf
        const calibrationCheckbox = screen.getByRole('checkbox', { name: 'CALIBRATION/VALIDATION' })
        await user.click(calibrationCheckbox)

        expect(calibrationCheckbox).toBeChecked()

        const addKeyword = screen.getByRole('button')

        await user.click(addKeyword)

        expect(props.onChange).toHaveBeenCalledTimes(1)
        expect(props.onChange).toHaveBeenCalledWith([
          {
            ToolCategory: 'EARTH SCIENCE SERVICES',
            ToolTopic: 'DATA ANALYSIS AND VISUALIZATION',
            ToolTerm: 'CALIBRATION/VALIDATION',
            ToolSpecificTerm: undefined
          }
        ])
      })
    })

    describe('when the selected keyword is already added', () => {
      test('does not add the duplicated keyword', async () => {
        const { props, user } = setup({
          formData: [{
            ToolCategory: 'EARTH SCIENCE SERVICES',
            ToolTopic: 'DATA ANALYSIS AND VISUALIZATION',
            ToolTerm: 'CALIBRATION/VALIDATION'
          }]
        })
        expect(await screen.findByText('EARTH SCIENCE SERVICES > DATA ANALYSIS AND VISUALIZATION > CALIBRATION/VALIDATION')).toBeInTheDocument()
        // Navigating into the first parent level
        const earthScienceServiceNav = screen.getByRole('link', { name: 'View EARTH SCIENCE SERVICES' })
        await user.click(earthScienceServiceNav)

        // Navigating into the second parent level
        const dataAnalysisNav = screen.getByRole('link', { name: 'View DATA ANALYSIS AND VISUALIZATION' })
        await user.click(dataAnalysisNav)

        // Selecting the leaf
        const calibrationCheckbox = screen.getByRole('checkbox', { name: 'CALIBRATION/VALIDATION' })
        await user.click(calibrationCheckbox)

        expect(calibrationCheckbox).toBeChecked()

        const addKeyword = screen.getAllByRole('button')[1]
        await user.click(addKeyword)

        expect(props.onChange).not.toHaveBeenCalledWith([
          {
            ToolCategory: 'EARTH SCIENCE SERVICES',
            ToolTopic: 'DATA ANALYSIS AND VISUALIZATION',
            ToolTerm: 'CALIBRATION/VALIDATION',
            ToolSpecificTerm: undefined
          }
        ])
      })
    })
  })

  describe('when uiSchema does not have ui:filter option', () => {
    test('renders all keywords without filtering', () => {
      setup({
        uiSchema: {
          'ui:field': 'keywordPicker',
          'ui:keyword_scheme': 'science_keywords',
          'ui:keyword_scheme_column_names': ['toolkeywords', 'category', 'topic', 'term', 'variable_level_1', 'variable_level_2', 'variable_level_3'],
          'ui:picker_title': 'TOOL KEYWORD',
          'ui:scheme_values': ['ToolCategory', 'ToolTopic', 'ToolTerm', 'ToolSpecificTerm'],
          'ui:title': 'Tool Keyword'
        }
      })

      expect(screen.getByText('EARTH SCIENCE SERVICES')).toBeInTheDocument()
      expect(screen.queryByText('DATA ANALYSIS AND VISUALIZATION')).not.toBeInTheDocument()
    })
  })
})

describe('when selecting previous', () => {
  test('moves up the picker one level up', async () => {
    const { user } = setup()
    // Navigating into the first parent level
    const earthScienceServiceNav = screen.getByRole('link', { name: 'View EARTH SCIENCE SERVICES' })
    await user.click(earthScienceServiceNav)

    expect(screen.getByText('DATA ANALYSIS AND VISUALIZATION')).toBeInTheDocument()

    const previous = screen.getByRole('link', { name: 'EARTH SCIENCE SERVICES' })
    await user.click(previous)

    const toolKeywords = screen.getByRole('link', { name: 'TOOL KEYWORD' })
    await user.click(toolKeywords)

    expect(screen.getByText('EARTH SCIENCE SERVICES')).toBeInTheDocument()
  })
})

describe('when a non-leaf level is picked directly, instead of navigating into it', () => {
  test('a parent is selectable the exact same way a leaf is -- picking it directly submits it as the final value', async () => {
    const { props, user } = setup({})

    // Navigating into the first parent level (View, not the select option)
    const earthScienceServiceNav = screen.getByRole('link', { name: 'View EARTH SCIENCE SERVICES' })
    await user.click(earthScienceServiceNav)

    // Selecting the second level directly -- its checkbox, the same control a leaf gets --
    // rather than navigating into it via "View ...".
    const dataAnalysisCheckbox = screen.getByRole('checkbox', { name: 'DATA ANALYSIS AND VISUALIZATION' })
    await user.click(dataAnalysisCheckbox)

    expect(dataAnalysisCheckbox).toBeChecked()

    const addKeyword = screen.getByRole('button')

    await user.click(addKeyword)

    expect(props.onChange).toHaveBeenCalledTimes(1)
    expect(props.onChange).toHaveBeenCalledWith([
      {
        ToolCategory: 'EARTH SCIENCE SERVICES',
        ToolTopic: 'DATA ANALYSIS AND VISUALIZATION',
        ToolTerm: undefined,
        ToolSpecificTerm: undefined
      }
    ])
  })

  test('selecting a parent does not navigate into it -- the current list stays the same', async () => {
    const { user } = setup()

    await user.click(screen.getByRole('link', { name: 'View EARTH SCIENCE SERVICES' }))
    await user.click(screen.getByRole('checkbox', { name: 'DATA ANALYSIS AND VISUALIZATION' }))

    // Still looking at Topics (DATA ANALYSIS AND VISUALIZATION's siblings), not its Terms.
    expect(screen.getByText('DATA MANAGEMENT/DATA HANDLING')).toBeInTheDocument()
    expect(screen.queryByText('CALIBRATION/VALIDATION')).not.toBeInTheDocument()
  })

  test('checking an already-checked checkbox unchecks it, clearing the pick', async () => {
    const { user } = setup()

    const checkbox = screen.getByRole('checkbox', { name: 'EARTH SCIENCE SERVICES' })

    await user.click(checkbox)
    expect(checkbox).toBeChecked()

    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  test('navigating into a parent does not select anything in the level it reveals', async () => {
    const { user } = setup()

    await user.click(screen.getByRole('link', { name: 'View EARTH SCIENCE SERVICES' }))

    // Now looking at Topics (DATA ANALYSIS AND VISUALIZATION, DATA MANAGEMENT/DATA HANDLING)
    // -- navigating alone should not have marked either as selected.
    expect(screen.queryByText('DATA ANALYSIS AND VISUALIZATION', { selector: '.final-option-selected' }))
      .not.toBeInTheDocument()

    expect(screen.queryByText('DATA MANAGEMENT/DATA HANDLING', { selector: '.final-option-selected' }))
      .not.toBeInTheDocument()
  })
})

describe('when the same instance switches to a different keyword scheme', () => {
  test('clears the stale breadcrumb and list from the previous scheme immediately, instead of leaving it on screen', async () => {
    const { user, rerenderWithUiSchema } = setup()

    // Navigate in, so there's a breadcrumb and a deeper list to go stale.
    await user.click(screen.getByRole('link', { name: 'View EARTH SCIENCE SERVICES' }))
    expect(screen.getByText('DATA ANALYSIS AND VISUALIZATION')).toBeInTheDocument()

    rerenderWithUiSchema({
      'ui:field': 'keywordPicker',
      'ui:keyword_scheme': 'location_keywords',
      'ui:keyword_scheme_column_names': ['locationkeywords', 'category', 'type', 'subregion_1', 'subregion_2', 'subregion_3'],
      'ui:picker_title': 'LOCATION KEYWORD',
      'ui:scheme_values': ['Category', 'Type', 'Subregion1', 'Subregion2', 'Subregion3'],
      'ui:title': 'Location Keyword'
    })

    // Nothing from the previous (Science Keywords) scheme's breadcrumb or list lingers.
    expect(screen.queryByText('EARTH SCIENCE SERVICES')).not.toBeInTheDocument()
    expect(screen.queryByText('DATA ANALYSIS AND VISUALIZATION')).not.toBeInTheDocument()
  })
})

// Without `ui:selectable_parents` (the real collection form's own uiSchema, e.g.
// descriptiveKeywords.js), the picker must render and behave exactly as it did before a
// parent level became directly selectable -- no checkbox, a parent only navigable, and no
// toggle-to-clear on an already-selected leaf.
describe('when ui:selectable_parents is not set', () => {
  const realFormUiSchema = {
    'ui:field': 'keywordPicker',
    'ui:filter': 'EARTH SCIENCE SERVICES',
    'ui:keyword_scheme': 'science_keywords',
    'ui:keyword_scheme_column_names': ['toolkeywords', 'category', 'topic', 'term', 'variable_level_1', 'variable_level_2', 'variable_level_3'],
    'ui:picker_title': 'TOOL KEYWORD',
    'ui:scheme_values': ['ToolCategory', 'ToolTopic', 'ToolTerm', 'ToolSpecificTerm'],
    'ui:title': 'Tool Keyword'
  }

  test('renders a parent as a plain navigable link, with no checkbox anywhere', async () => {
    const { user } = setup({ uiSchema: realFormUiSchema })

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'EARTH SCIENCE SERVICES' }))

    expect(screen.getByText('DATA ANALYSIS AND VISUALIZATION')).toBeInTheDocument()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })

  test('clicking an already-selected leaf again keeps it selected, instead of clearing it', async () => {
    const { props, user } = setup({ uiSchema: realFormUiSchema })

    await user.click(screen.getByRole('link', { name: 'EARTH SCIENCE SERVICES' }))
    await user.click(screen.getByRole('link', { name: 'DATA ANALYSIS AND VISUALIZATION' }))

    const calibration = screen.getByRole('link', { name: 'CALIBRATION/VALIDATION' })
    await user.click(calibration)
    await user.click(calibration)

    expect(screen.getByText('CALIBRATION/VALIDATION', { selector: '.final-option-selected' }))
      .toBeInTheDocument()

    await user.click(screen.getByRole('button'))

    expect(props.onChange).toHaveBeenCalledWith([{
      ToolCategory: 'EARTH SCIENCE SERVICES',
      ToolTopic: 'DATA ANALYSIS AND VISUALIZATION',
      ToolTerm: 'CALIBRATION/VALIDATION',
      ToolSpecificTerm: undefined
    }])
  })
})

describe('when removing selected keyword', () => {
  test('removes the selected keyword', async () => {
    const { props, user } = setup({
      formData: [{
        ToolCategory: 'EARTH SCIENCE SERVICES',
        ToolTopic: 'DATA ANALYSIS AND VISUALIZATION',
        ToolTerm: 'CALIBRATION/VALIDATION'
      }]
    })
    const removeBtn = screen.getAllByRole('button')[0]

    await user.click(removeBtn)

    expect(props.onChange).toHaveBeenCalledTimes(1)
  })
})

describe('when searching for a keyword', () => {
  describe('and user selects a keyword', () => {
    test('adds the searched keyword', async () => {
      const { props, user } = setup()

      const searchBox = screen.getByRole('combobox')

      await user.type(searchBox, 'Earth')
      const option = screen.getByRole('option', { name: 'EARTH SCIENCE SERVICES>DATA ANALYSIS AND VISUALIZATION>GEOGRAPHIC INFORMATION SYSTEMS>DESKTOP GEOGRAPHIC INFORMATION SYSTEMS' })
      await user.click(option)

      expect(props.onChange).toHaveBeenCalledTimes(1)
      expect(props.onChange).toHaveBeenCalledWith([
        {
          ToolCategory: 'EARTH SCIENCE SERVICES',
          ToolTopic: 'DATA ANALYSIS AND VISUALIZATION',
          ToolTerm: 'GEOGRAPHIC INFORMATION SYSTEMS',
          ToolSpecificTerm: 'DESKTOP GEOGRAPHIC INFORMATION SYSTEMS'
        }
      ])
    })

    test('clears the search box after the selection', async () => {
      const { user } = setup()

      const searchBox = screen.getByRole('combobox')

      await user.type(searchBox, 'Earth')

      expect(searchBox).toHaveValue('Earth')
      const option = screen.getByRole('option', { name: 'EARTH SCIENCE SERVICES>DATA ANALYSIS AND VISUALIZATION>GEOGRAPHIC INFORMATION SYSTEMS>DESKTOP GEOGRAPHIC INFORMATION SYSTEMS' })
      await user.click(option)
      expect(searchBox).toHaveValue('')
    })
  })

  describe('when keyword recommender is included', () => {
    test('keyword picker is rendered', () => {
      setup({}, true)
      expect(KeywordRecommendations).toHaveBeenCalled()
    })
  })
})
