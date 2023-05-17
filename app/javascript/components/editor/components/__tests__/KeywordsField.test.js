import React from 'react'
import Form from '@rjsf/bootstrap-4'
import {
  render, fireEvent, screen
} from '@testing-library/react'
import validator from '@rjsf/validator-ajv8'
import { act } from 'react-dom/test-utils'
import ToolKeywordsField from '../KeywordPicker'
import { MetadataService } from '../../services/MetadataService'
import EarthScienceServicesKeywords from '../../data/test/earth_science_services_keywords'
import UmmToolsModel from '../../model/UmmToolsModel'
import MetadataEditor from '../../MetadataEditor'

global.fetch = require('jest-fetch-mock')

const schema = {
  ToolKeywords: {
    title: 'Tool Keywords',
    type: 'object',
    properties: {
      ToolCategory: {
        type: 'string'
      },
      ToolTopic: {
        type: 'string'
      },
      ToolTerm: {
        type: 'string'
      },
      ToolSpecificTerm: {
        type: 'string'
      }
    }
  },
  minItems: 0
}

const fields = {
  toolKeywordsField: ToolKeywordsField
}

const props = {
  formData: undefined
}

describe('Tool Keywords test with keywords from CMR', () => {
  const metadataService = new MetadataService('test_token', 'tool_drafts', 'test_user', 'provider')

  it('testing a valid set keywords with a filter being passed in', async () => {
    const uiSchema = {
      'ui:field': 'toolKeywordsField',
      'ui:keyword_scheme': 'science_keywords',
      'ui:picker_title': 'TOOL KEYWORD',
      'ui:scheme_values': [
        'ToolCategory', 'ToolTopic', 'ToolTerm', 'ToolSpecificTerm'
      ],
      'ui:keyword_scheme_column_names': ['toolkeywords', 'category', 'topic', 'term', 'variable_level_1', 'variable_level_2', 'variable_level_3'],
      'ui:filter': (path) => path[1] !== 'EARTH SCIENCE',

      'ui:service': metadataService
    }
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
      ok: true,
      status: 200,
      json: () => (
        EarthScienceServicesKeywords
      )
    }))
    const { container } = render(<Form validator={validator} schema={schema} uiSchema={uiSchema} fields={fields} />)
    await act(async () => null)
    const value = screen.queryByTestId('tool-keyword__parent-item--EARTH SCIENCE SERVICES')
    expect(value).toHaveTextContent('EARTH SCIENCE SERVICES')
    expect(container).toMatchSnapshot()
  })

  it('testing invalid set of keywords', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)

    const uiSchema = {
      'ui:field': 'toolKeywordsField',
      'ui:keyword_scheme': 'science_keywords',
      'ui:picker_title': 'TOOL KEYWORD',
      'ui:scheme_values': [
        'ToolCategory', 'ToolTopic', 'ToolTerm', 'ToolSpecificTerm'
      ],
      'ui:keyword_scheme_column_names': ['toolkeywords', 'category', 'topic', 'term', 'variable_level_1', 'variable_level_2', 'variable_level_3'],

      'ui:service': metadataService

    }
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
      ok: false,
      status: 500,
      json: () => (
        EarthScienceServicesKeywords
      )
    }))
    const { container } = render(<Form formContext={{ editor }} validator={validator} schema={schema} uiSchema={uiSchema} fields={fields} />)
    await act(async () => null)
    expect(container).toHaveTextContent('Loading...')
    expect(container).toMatchSnapshot()
  })
  it('testing vaid set of keywords with no filter being passed in', async () => {
    const uiSchema = {
      'ui:field': 'toolKeywordsField',
      'ui:keyword_scheme': 'science_keywords',
      'ui:picker_title': 'TOOL KEYWORD',
      'ui:scheme_values': [
        'ToolCategory', 'ToolTopic', 'ToolTerm', 'ToolSpecificTerm'
      ],
      'ui:keyword_scheme_column_names': ['toolkeywords', 'category', 'topic', 'term', 'variable_level_1', 'variable_level_2', 'variable_level_3'],
      'ui:service': metadataService

    }
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
      ok: true,
      status: 200,
      json: () => (
        EarthScienceServicesKeywords
      )
    }))
    const { container } = render(<Form validator={validator} schema={schema} uiSchema={uiSchema} fields={fields} />)
    await act(async () => null)
    expect(container).toMatchSnapshot()
  })
})
describe('Tool Keywords Field', () => {
  const keywords = [
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
  ]
  const uiSchema = {
    'ui:title': 'Tool Keyword',
    'ui:field': 'toolKeywordsField',
    'ui:keywords': keywords,
    'ui:scheme_values': [
      'ToolCategory', 'ToolTopic', 'ToolTerm', 'ToolSpecificTerm'
    ]
  }

  it('Adding a science keyword without ToolSpecificTerm', async () => {
    const props = {
      require: false,
      formData: [{}]
    }
    const { container } = render(<Form validator={validator} schema={schema} uiSchema={uiSchema} fields={fields} {...props} />)
    const clickParent1 = screen.queryByTestId('tool-keyword__parent-item--EARTH SCIENCE SERVICES')
    fireEvent.click(await clickParent1)

    const clickParent2 = screen.queryByTestId('tool-keyword__parent-item--DATA ANALYSIS AND VISUALIZATION')
    fireEvent.click(await clickParent2)

    const clickFinalOption = screen.queryByTestId('tool-keyword__final-option--calibration-validation')
    fireEvent.click(await clickFinalOption)

    expect(screen.queryByTestId('tool-keyword__final-option-selected--calibration-validation')).toHaveTextContent('CALIBRATION/VALIDATION')

    const selectedOption = screen.queryByTestId('tool-keyword__final-option-selected--calibration-validation')
    fireEvent.click(await clickFinalOption)
    fireEvent.click(await selectedOption)

    const addKeyword = screen.queryByTestId('tool-keyword__add-keyword-btn')
    fireEvent.click(await addKeyword)

    expect(screen.queryByTestId('added-tool-keywords')).toHaveTextContent('EARTH SCIENCE SERVICES > DATA ANALYSIS AND VISUALIZATION > CALIBRATION/VALIDATION')
    expect(container).toMatchSnapshot()
  })

  it('Adding a science keyword with ToolSpecificTerm', async () => {
    const { container } = render(<Form validator={validator} schema={schema} uiSchema={uiSchema} fields={fields} {...props} />)
    const clickParent1 = screen.queryByTestId('tool-keyword__parent-item--EARTH SCIENCE SERVICES')
    fireEvent.click(await clickParent1)

    const clickParent2 = screen.queryByTestId('tool-keyword__parent-item--DATA ANALYSIS AND VISUALIZATION')
    fireEvent.click(await clickParent2)

    const clickParent3 = screen.queryByTestId('tool-keyword__parent-item--GEOGRAPHIC INFORMATION SYSTEMS')
    fireEvent.click(await clickParent3)

    const selectOption = screen.queryByTestId('tool-keyword__final-option--desktop-geographic-information-systems')
    fireEvent.click(await selectOption)

    const addKeyword = screen.queryByTestId('tool-keyword__add-keyword-btn')
    fireEvent.click(await addKeyword)

    expect(screen.queryByTestId('added-tool-keywords')).toHaveTextContent('EARTH SCIENCE SERVICES > DATA ANALYSIS AND VISUALIZATION > GEOGRAPHIC INFORMATION SYSTEMS > DESKTOP GEOGRAPHIC INFORMATION SYSTEMS')
    expect(container).toMatchSnapshot()
  })

  it('Adding a science keyword with ToolSoecificTerm and removing from added keyword', async () => {
    const { container } = render(<Form validator={validator} schema={schema} uiSchema={uiSchema} fields={fields} {...props} />)

    const clickParent1 = screen.queryByTestId('tool-keyword__parent-item--EARTH SCIENCE SERVICES')
    fireEvent.click(await clickParent1)

    const clickParent2 = screen.queryByTestId('tool-keyword__parent-item--DATA ANALYSIS AND VISUALIZATION')
    fireEvent.click(await clickParent2)

    const clickParent3 = screen.queryByTestId('tool-keyword__parent-item--GEOGRAPHIC INFORMATION SYSTEMS')
    fireEvent.click(await clickParent3)

    const selectOption = screen.queryByTestId('tool-keyword__final-option--desktop-geographic-information-systems')
    fireEvent.click(await selectOption)

    const addKeyword = screen.queryByTestId('tool-keyword__add-keyword-btn')
    fireEvent.click(await addKeyword)

    expect(screen.queryByTestId('added-tool-keywords')).toHaveTextContent('EARTH SCIENCE SERVICES > DATA ANALYSIS AND VISUALIZATION > GEOGRAPHIC INFORMATION SYSTEMS > DESKTOP GEOGRAPHIC INFORMATION SYSTEMS')

    const remove = screen.queryByTestId('tool-keyword__added-keyword--0')
    fireEvent.click(await remove)
    expect(screen.queryByTestId('added-tool-keywords')).not.toHaveTextContent('EARTH SCIENCE SERVICES > DATA ANALYSIS AND VISUALIZATION > GEOGRAPHIC INFORMATION SYSTEMS > DESKTOP GEOGRAPHIC INFORMATION SYSTEMS')
    expect(container).toMatchSnapshot()
  })

  it('Selecting Previous Section Test', async () => {
    const { container } = render(<Form validator={validator} schema={schema} uiSchema={uiSchema} fields={fields} {...props} />)

    const clickParent1 = screen.queryByTestId('tool-keyword__parent-item--EARTH SCIENCE SERVICES')
    fireEvent.click(await clickParent1)

    const clickParent2 = screen.queryByTestId('tool-keyword__parent-item--DATA ANALYSIS AND VISUALIZATION')
    fireEvent.click(await clickParent2)

    const clickParent3 = screen.queryByTestId('tool-keyword__parent-item--GEOGRAPHIC INFORMATION SYSTEMS')
    fireEvent.click(await clickParent3)

    const clickPreviousFirst = screen.queryByTestId('tool-keyword__select-previous--tool-keyword')
    fireEvent.click(await clickPreviousFirst)

    const clickParent1Again = screen.queryByTestId('tool-keyword__parent-item--EARTH SCIENCE SERVICES')
    fireEvent.click(await clickParent1Again)

    const clickParent2Again = screen.queryByTestId('tool-keyword__parent-item--DATA ANALYSIS AND VISUALIZATION')
    fireEvent.click(await clickParent2Again)

    const clickPreviousSecond = screen.queryByTestId('tool-keyword__select-previous--data-analysis-and-visualization')

    fireEvent.click(await clickPreviousSecond)
    fireEvent.click(await screen.queryByTestId('tool-keyword__parent-item--DATA ANALYSIS AND VISUALIZATION'))

    fireEvent.click(await screen.queryByTestId('tool-keyword__parent-item--GEOGRAPHIC INFORMATION SYSTEMS'))
    expect(container).toMatchSnapshot()

    const clickPrevious = screen.queryByTestId('tool-keyword__select-previous--geographic-information-systems')
    fireEvent.click(await clickPrevious)
  })

  it('Test Adding the Same Keyword with ToolSpecificTerm', async () => {
    const { container } = render(<Form validator={validator} schema={schema} uiSchema={uiSchema} fields={fields} {...props} />)

    const clickParent1 = screen.queryByTestId('tool-keyword__parent-item--EARTH SCIENCE SERVICES')
    fireEvent.click(await clickParent1)

    const clickParent2 = screen.queryByTestId('tool-keyword__parent-item--DATA ANALYSIS AND VISUALIZATION')
    fireEvent.click(await clickParent2)

    const clickParent3 = screen.queryByTestId('tool-keyword__parent-item--GEOGRAPHIC INFORMATION SYSTEMS')
    fireEvent.click(await clickParent3)

    const clickFinalOption = screen.queryByTestId('tool-keyword__final-option--mobile-geographic-information-systems')
    fireEvent.click(await clickFinalOption)

    const addKeyword = screen.queryByTestId('tool-keyword__add-keyword-btn')
    fireEvent.click(await addKeyword)

    // check if the science key word was added.
    expect(screen.queryByTestId('added-tool-keywords')).toHaveTextContent('EARTH SCIENCE SERVICES > DATA ANALYSIS AND VISUALIZATION > GEOGRAPHIC INFORMATION SYSTEMS > MOBILE GEOGRAPHIC INFORMATION SYSTEMS')

    // Try adding the same keyword again
    fireEvent.click(await clickFinalOption)
    fireEvent.click(await addKeyword)
    expect(container).toMatchSnapshot()
  })

  it('Test Adding the Same Keyword without ToolSpecificTerm', async () => {
    const { container } = render(<Form validator={validator} schema={schema} uiSchema={uiSchema} fields={fields} {...props} />)

    const clickParent1 = screen.queryByTestId('tool-keyword__parent-item--EARTH SCIENCE SERVICES')
    fireEvent.click(await clickParent1)

    const clickParent2 = screen.queryByTestId('tool-keyword__parent-item--DATA MANAGEMENT/DATA HANDLING')
    fireEvent.click(await clickParent2)

    const clickFinalOption = screen.queryByTestId('tool-keyword__final-option--cataloging')
    fireEvent.click(await clickFinalOption)

    const addKeyword = screen.queryByTestId('tool-keyword__add-keyword-btn')
    fireEvent.click(await addKeyword)

    // check if the science key word was added.
    expect(screen.queryByTestId('added-tool-keywords')).toHaveTextContent('EARTH SCIENCE SERVICES > DATA MANAGEMENT/DATA HANDLING > CATALOGING')

    // Try adding the same keyword again
    fireEvent.click(await clickFinalOption)
    fireEvent.click(await addKeyword)
    expect(container).toMatchSnapshot()
  })

  it('Search Keyword Test', async () => {
    const { getByTestId, container } = render(<Form validator={validator} schema={schema} uiSchema={uiSchema} fields={fields} {...props} />)
    const searchField = getByTestId('tool-keyword__search-keyword-field').querySelector('input')
    fireEvent.change(searchField, { target: { value: 'Earth' } })
    fireEvent.keyDown(searchField, { key: 'ArrowDown' })
    fireEvent.keyDown(searchField, { key: 'Enter' })

    fireEvent.change(searchField, { target: { value: '' } })
    fireEvent.change(searchField, { target: { value: 'Earth' } })
    fireEvent.keyDown(searchField, { key: 'ArrowDown' })
    fireEvent.keyDown(searchField, { key: 'Enter' })
    const clickParent1 = screen.queryByTestId('tool-keyword__parent-item--EARTH SCIENCE SERVICES')
    fireEvent.click(await clickParent1)

    const clickParent2 = screen.queryByTestId('tool-keyword__parent-item--DATA ANALYSIS AND VISUALIZATION')
    fireEvent.click(await clickParent2)

    const clickParent3 = screen.queryByTestId('tool-keyword__parent-item--GEOGRAPHIC INFORMATION SYSTEMS')
    fireEvent.click(await clickParent3)

    fireEvent.change(searchField, { target: { value: 'Mobile' } })
    fireEvent.keyDown(searchField, { key: 'ArrowDown' })
    fireEvent.keyDown(searchField, { key: 'Enter' })

    fireEvent.focusOut(searchField)
    expect(container).toMatchSnapshot()
  })
})
