import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import CustomSelectWidget from '../../CustomSelectWidget/CustomSelectWidget'
import CustomTextWidget from '../../CustomTextWidget/CustomTextWidget'
import GridControlledField from '../GridControlledField'

import AppContext from '../../../context/AppContext'

import useControlledKeywords from '../../../hooks/useControlledKeywords'

import { relatedUrlsKeywords } from './__mocks__/relatedUrlsKeywords'
import { selectProps } from './__mocks__/selectProps'
import { textProps } from './__mocks__/textProps'
import { providersKeywords } from './__mocks__/providersKeywords'

jest.mock('../../../hooks/useControlledKeywords')
jest.mock('../../CustomTextWidget/CustomTextWidget', () => jest.fn(({
  onChange
}) => (
  // This mock component renders a single input field for a 'Name' field. This allows the
  // tests that need to call onChange/onBlur to actually modify the state/context in GridControlledField
  <mock-Component data-testid="MockCustomTextWidget">
    <input
      id="Name"
      name="Name"
      onChange={
        (event) => {
          const { value: newValue } = event.target

          onChange(newValue)
        }
      }
      value=""
    />
  </mock-Component>
)))

jest.mock('../../CustomSelectWidget/CustomSelectWidget', () => jest.fn(({
  onChange
}) => (
  // This mock component renders a single select field for a 'Name' field. This allows the
  // tests that need to call onChange/onBlur to actually modify the state/context in GridControlledField
  <mock-Component data-testid="MockCustomSelectWidget">
    <select
      id="Name"
      name="Name"
      onChange={
        (event) => {
          const { value: newValue } = event.target

          onChange(newValue)
        }
      }
    >
      <option value="DataCenterURL">DataCenterURL</option>
    </select>
  </mock-Component>
)))

const setup = (fieldType, overrideProps = {}, keywordsValue = {}) => {
  useControlledKeywords.mockReturnValue(keywordsValue)

  const selectFieldProps = {
    ...selectProps,
    ...overrideProps
  }

  const textFieldProps = {
    ...textProps,
    ...overrideProps
  }

  const props = fieldType === 'select' ? selectFieldProps : textFieldProps

  const draft = {}

  render(
    <AppContext.Provider value={draft}>
      <GridControlledField {...props} />
    </AppContext.Provider>
  )

  return {
    props,
    user: userEvent.setup()
  }
}

describe('GridControlledField', () => {
  describe('when the widget is a CustomTextWidget', () => {
    describe('when the parent field has not been selected', () => {
      test('renders a CustomTextWidget', async () => {
        setup(
          'text',
          {},
          {
            keywords: providersKeywords,
            isLoading: false
          }
        )

        expect(CustomTextWidget).toHaveBeenCalledTimes(2)
        expect(CustomTextWidget).toHaveBeenCalledWith(expect.objectContaining({
          disabled: true,
          id: '_Organizations_0_LongName',
          label: 'LongName',
          name: 'LongName',
          onBlur: undefined,
          onFocus: undefined,
          placeholder: undefined,
          required: false,
          schema: {
            description: 'This is the long name of the organization.',
            maxLength: 1024,
            minLength: 1,
            type: 'string'
          },
          value: ''
        }), {})
      })
    })

    describe('when the parent field has been selected', () => {
      test('renders a CustomTextWidget', async () => {
        setup(
          'text',
          {
            formData: {
              ShortName: 'ESA/ED'
            }
          },
          {
            keywords: providersKeywords,
            isLoading: false
          }
        )

        expect(CustomTextWidget).toHaveBeenCalledTimes(2)
        expect(CustomTextWidget).toHaveBeenCalledWith(expect.objectContaining({
          disabled: true,
          id: '_Organizations_0_LongName',
          label: 'LongName',
          name: 'LongName',
          onBlur: undefined,
          onFocus: undefined,
          placeholder: undefined,
          required: false,
          schema: {
            description: 'This is the long name of the organization.',
            enum: ['Educational Office, Ecological Society of America'],
            maxLength: 1024,
            minLength: 1,
            type: 'string'
          },
          value: 'Educational Office, Ecological Society of America'
        }), {})
      })
    })
  })

  describe('when the widget is a CustomSelectWidget', () => {
    describe('when the keywords are loading', () => {
      test('renders a CustomSelectWidget', async () => {
        setup(
          'select',
          {},
          {
            keywords: {},
            isLoading: true
          }
        )

        expect(CustomSelectWidget).toHaveBeenCalledTimes(2)
        expect(CustomSelectWidget).toHaveBeenCalledWith(expect.objectContaining({
          disabled: true,
          id: '_RelatedURLs_0_URLContentType',
          isLoading: true,
          label: 'URLContentType',
          name: 'URLContentType',
          placeholder: 'Fetching keywords...',
          required: true,
          schema: {
            description: 'A keyword describing the distinct content type of the online resource to this resource. This helps software present the information to the user. The valid values are contained in the KMS System: https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/all/8759ab63-ac04-4136-bc25-0c00eece1096/.',
            enum: ['DataCenterURL', 'PublicationURL', 'DataContactURL', 'VisualizationURL', 'DistributionURL', 'CollectionURL'],
            maxLength: 80,
            minLength: 1,
            type: 'string'
          },
          selectOptions: [],
          uiSchema: {},
          value: undefined
        }), {})
      })
    })

    describe('when the keywords are loaded', () => {
      test('renders a CustomSelectWidget', async () => {
        setup(
          'select',
          {},
          {
            keywords: relatedUrlsKeywords,
            isLoading: false
          }
        )

        expect(CustomSelectWidget).toHaveBeenCalledTimes(2)
        expect(CustomSelectWidget).toHaveBeenCalledWith(expect.objectContaining({
          disabled: false,
          id: '_RelatedURLs_0_URLContentType',
          isLoading: false,
          label: 'URLContentType',
          name: 'URLContentType',
          placeholder: 'Select URLContentType',
          required: true,
          schema: {
            description: 'A keyword describing the distinct content type of the online resource to this resource. This helps software present the information to the user. The valid values are contained in the KMS System: https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/all/8759ab63-ac04-4136-bc25-0c00eece1096/.',
            enum: ['DataCenterURL', 'PublicationURL', 'DataContactURL', 'VisualizationURL', 'DistributionURL', 'CollectionURL'],
            maxLength: 80,
            minLength: 1,
            type: 'string'
          },
          selectOptions: [
            'DataCenterURL',
            'PublicationURL',
            'DataContactURL',
            'VisualizationURL',
            'DistributionURL',
            'CollectionURL'
          ],
          uiSchema: {},
          value: undefined
        }), {})
      })
    })

    describe('when the widget is controlled by another field', () => {
      describe('when the parent field has not been selected', () => {
        test('renders a CustomSelectWidget', async () => {
          setup(
            'select',
            {
              controlName: 'type',
              formData: {},
              name: 'Type'
            },
            {
              keywords: relatedUrlsKeywords,
              isLoading: false
            }
          )

          expect(CustomSelectWidget).toHaveBeenCalledTimes(2)
          expect(CustomSelectWidget).toHaveBeenCalledWith(expect.objectContaining({
            disabled: true,
            id: '_RelatedURLs_0_Type',
            isLoading: false,
            label: 'Type',
            name: 'Type',
            placeholder: 'No available Type',
            required: true,
            schema: {
              description: 'A keyword describing the type of the online resource to this resource. This helps software present the information to the user. The valid values are contained in the KMS System: https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/all/8759ab63-ac04-4136-bc25-0c00eece1096/.',
              maxLength: 80,
              minLength: 1,
              type: 'string'
            },
            selectOptions: [],
            uiSchema: {},
            value: undefined
          }), {})
        })
      })

      describe('when the parent field has been selected', () => {
        test('renders a CustomSelectWidget', async () => {
          setup(
            'select',
            {
              controlName: 'type',
              formData: {
                URLContentType: 'DataCenterURL'
              },
              name: 'Type'
            },

            {
              keywords: relatedUrlsKeywords,
              isLoading: false
            }
          )

          expect(CustomSelectWidget).toHaveBeenCalledTimes(2)
          expect(CustomSelectWidget).toHaveBeenCalledWith(expect.objectContaining({
            disabled: false,
            id: '_RelatedURLs_0_Type',
            isLoading: false,
            label: 'Type',
            name: 'Type',
            placeholder: 'Select Type',
            required: true,
            schema: {
              description: 'A keyword describing the type of the online resource to this resource. This helps software present the information to the user. The valid values are contained in the KMS System: https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/all/8759ab63-ac04-4136-bc25-0c00eece1096/.',
              enum: ['HOME PAGE'],
              maxLength: 80,
              minLength: 1,
              type: 'string'
            },
            selectOptions: ['HOME PAGE'],
            uiSchema: {},
            value: undefined
          }), {})
        })
      })
    })

    describe('when the field is not required', () => {
      describe('when the parent field has been selected', () => {
        test('renders a CustomSelectWidget', async () => {
          setup(
            'select',
            {
              controlName: 'subtype',
              formData: {
                URLContentType: 'DataCenterURL'
              },
              name: 'Subtype'
            },
            {
              keywords: relatedUrlsKeywords,
              isLoading: false
            }
          )

          expect(CustomSelectWidget).toHaveBeenCalledTimes(2)
          expect(CustomSelectWidget).toHaveBeenCalledWith(expect.objectContaining({
            disabled: true,
            id: '_RelatedURLs_0_Subtype',
            isLoading: false,
            label: 'Subtype',
            name: 'Subtype',
            placeholder: 'No available Subtype',
            required: false,
            schema: {
              description: 'A keyword describing the subtype of the online resource to this resource. This helps software present the information to the user. The valid values are contained in the KMS System: https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/all/8759ab63-ac04-4136-bc25-0c00eece1096/.',
              maxLength: 80,
              minLength: 1,
              type: 'string'
            },
            selectOptions: [null],
            uiSchema: {},
            value: undefined
          }), {})
        })
      })
    })

    describe('when the value of the CustomSelectWidget widget is changed', () => {
      test('calls onChange', async () => {
        const { props, user } = setup(
          'select',
          {},
          {
            keywords: relatedUrlsKeywords,
            isLoading: false
          }
        )

        const select = screen.getByRole('combobox')
        await user.selectOptions(select, 'DataCenterURL')

        expect(props.onChange).toHaveBeenCalledTimes(1)
        expect(props.onChange).toHaveBeenCalledWith({ URLContentType: 'DataCenterURL' }, null)
      })

      describe('when onSelectValue is defined', () => {
        test('calls onSelectValue', async () => {
          const { props, user } = setup(
            'select',
            {
              onSelectValue: jest.fn()
            },
            {
              keywords: relatedUrlsKeywords,
              isLoading: false
            }
          )

          const select = screen.getByRole('combobox')
          await user.selectOptions(select, 'DataCenterURL')

          expect(props.onChange).toHaveBeenCalledTimes(1)
          expect(props.onChange).toHaveBeenCalledWith({ URLContentType: 'DataCenterURL' }, null)

          expect(props.onSelectValue).toHaveBeenCalledTimes(1)
          expect(props.onSelectValue).toHaveBeenCalledWith('URLContentType', 'DataCenterURL')
        })
      })
    })
  })
})
