import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import useControlledKeywords from '../../../hooks/useControlledKeywords'
import parseCmrResponse from '../../../utils/parseCmrResponse'
import KeywordPicker from '../KeywordPicker'

jest.mock('../../../hooks/useControlledKeywords')
jest.mock('../../../utils/parseCmrResponse')

const setup = (overrideProps = {}) => {
  const onChange = jest.fn()

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
    'ui:title': 'Tool Keyword',
    'ui:field': 'keywordPicker',
    'ui:keyword_scheme': 'science_keywords',
    'ui:picker_title': 'TOOL KEYWORD',
    'ui:keyword_scheme_column_names': ['toolkeywords', 'category', 'topic', 'term', 'variable_level_1', 'variable_level_2', 'variable_level_3'],
    'ui:filter': 'EARTH SCIENCE SERVICES',
    'ui:scheme_values': ['ToolCategory', 'ToolTopic', 'ToolTerm', 'ToolSpecificTerm']
  }
  const props = {
    formData: [],
    schema,
    uiSchema,
    required: false,
    onChange,
    ...overrideProps
  }

  render(
    <BrowserRouter>
      <KeywordPicker {...props} />
    </BrowserRouter>
  )

  return {
    props,
    user: userEvent.setup()
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

  describe('when adding a keyword', () => {
    describe('when the selected keyword is not already added', () => {
      test('adds the selected keyword', async () => {
        const { props, user } = setup({})

        // Clicking on the first parent element
        const earthScienceServiceBtn = screen.getByRole('link', { name: 'EARTH SCIENCE SERVICES' })
        await user.click(earthScienceServiceBtn)

        // Clicking on the second parent element
        const dataAnalysisButton = screen.getByRole('link', { name: 'DATA ANALYSIS AND VISUALIZATION' })
        await user.click(dataAnalysisButton)

        // Clicking on the child element
        const calibrationBtn = screen.getByRole('link', { name: 'CALIBRATION/VALIDATION' })
        await user.click(calibrationBtn)

        expect(screen.getAllByRole('link', { class: 'final-option-selected' }))

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
        expect(screen.queryByText('EARTH SCIENCE SERVICES > DATA ANALYSIS AND VISUALIZATION > CALIBRATION/VALIDATION')).toBeInTheDocument()
        // Clicking on the first parent element
        const earthScienceServiceBtn = screen.getByRole('link', { name: 'EARTH SCIENCE SERVICES' })
        await user.click(earthScienceServiceBtn)

        // Clicking on the second parent element
        const dataAnalysisButton = screen.getByRole('link', { name: 'DATA ANALYSIS AND VISUALIZATION' })
        await user.click(dataAnalysisButton)

        // Clicking on the child element
        const calibrationBtn = screen.getByRole('link', { name: 'CALIBRATION/VALIDATION' })
        await user.click(calibrationBtn)

        expect(screen.getAllByRole('link', { class: 'final-option-selected' }))

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
})

describe('when selecting previous', () => {
  test('moves up the picker one level up', async () => {
    const { user } = setup()
    // Clicking on the first parent element
    const earthScienceServiceBtn = screen.getByRole('link', { name: 'EARTH SCIENCE SERVICES' })
    await user.click(earthScienceServiceBtn)

    expect(screen.getByText('DATA ANALYSIS AND VISUALIZATION')).toBeInTheDocument()

    const previous = screen.getByRole('link', { name: 'EARTH SCIENCE SERVICES' })
    await user.click(previous)

    const toolKeywords = screen.getByRole('link', { name: 'TOOL KEYWORD' })
    await user.click(toolKeywords)

    expect(screen.getByText('EARTH SCIENCE SERVICES')).toBeInTheDocument()
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
  test('adds the searched keyword', async () => {
    const { props, user } = setup()

    const searchBox = screen.getByRole('combobox')

    await user.type(searchBox, 'Earth')
    const option = screen.getByRole('option', { name: 'EARTH SCIENCE SERVICES>DATA ANALYSIS AND VISUALIZATION>GEOGRAPHIC INFORMATION SYSTEMS>DESKTOP GEOGRAPHIC INFORMATION SYSTEMS' })
    await user.click(option)

    expect(props.onChange).toHaveBeenCalledTimes(1)
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
