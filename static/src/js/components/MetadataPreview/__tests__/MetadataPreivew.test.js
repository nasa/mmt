import {
  CollectionPreview,
  ServicePreview,
  ToolPreview,
  VariablePreview
} from '@edsc/metadata-preview'
import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'
import MetadataPreview from '../MetadataPreview'

jest.mock('@edsc/metadata-preview')

const setup = (overrideProps = {}) => {
  const props = {
    previewMetadata: {},
    conceptId: '',
    conceptType: '',
    ...overrideProps
  }
  render(
    <MetadataPreview {...props} />
  )

  return {
    props,
    user: userEvent.setup()
  }
}

describe('MetadataPreview', () => {
  describe('when the conceptType is Tool draft', () => {
    test(' renders a ToolPreview component', async () => {
      setup({
        previewMetadata: {
          name: 'mock tool test'
        },
        conceptId: 'TD000000-MMT',
        conceptType: 'Tool'
      })

      await waitForResponse()
      expect(ToolPreview).toHaveBeenCalledTimes(1)
      expect(ToolPreview).toHaveBeenCalledWith({
        conceptId: 'TD000000-MMT',
        conceptType: 'tool',
        conceptUrlTemplate: '/{conceptType}/{conceptId}',
        isPlugin: true,
        tool: {
          name: 'mock tool test'
        }
      }, {})
    })
  })

  describe('when the conceptType is Service draft', () => {
    test('renders a Service Preview component', async () => {
      setup({
        previewMetadata: {
          name: 'mock service test'
        },
        conceptId: 'SD000000-MMT',
        conceptType: 'Service'
      })

      await waitForResponse()
      expect(ServicePreview).toHaveBeenCalledTimes(1)
      expect(ServicePreview).toHaveBeenCalledWith({
        conceptId: 'SD000000-MMT',
        conceptType: 'service',
        conceptUrlTemplate: '/{conceptType}/{conceptId}',
        isPlugin: true,
        service: {
          name: 'mock service test'
        }
      }, {})
    })
  })

  describe('when the conceptType is Variable draft', () => {
    test('renders a Variable Preview component', async () => {
      setup({
        previewMetadata: {
          name: 'mock variable test'
        },
        conceptId: 'VD000000-MMT',
        conceptType: 'Variable'
      })

      await waitForResponse()
      expect(VariablePreview).toHaveBeenCalledTimes(1)
      expect(VariablePreview).toHaveBeenCalledWith({
        conceptId: 'VD000000-MMT',
        conceptType: 'variable',
        conceptUrlTemplate: '/{conceptType}/{conceptId}',
        isPlugin: true,
        variable: {
          name: 'mock variable test'
        }
      }, {})
    })
  })

  describe('when the conceptType is Collection draft', () => {
    test('renders a Collection Preview component', async () => {
      setup({
        previewMetadata: {
          name: 'mock collection test'
        },
        conceptId: 'CD000000-MMT',
        conceptType: 'Collection'
      })

      await waitForResponse()
      expect(CollectionPreview).toHaveBeenCalledTimes(1)
      expect(CollectionPreview).toHaveBeenCalledWith({
        cmrHost: 'https://cmr.earthdata.nasa.gov',
        conceptId: 'CD000000-MMT',
        conceptType: 'collection',
        conceptUrlTemplate: '/{conceptType}/{conceptId}',
        isPlugin: true,
        collection: {
          name: 'mock collection test'
        },
        token: null
      }, {})
    })
  })

  describe('when the conceptType is not valid', () => {
    test('renders a Collection Preview component', async () => {
      setup({
        previewMetadata: {
          name: 'mock collection test'
        },
        conceptId: 'CD000000-MMT',
        conceptType: 'bad concept type'
      })

      expect(CollectionPreview).not.toHaveBeenCalledTimes(1)
      expect(ServicePreview).not.toHaveBeenCalledTimes(1)
      expect(VariablePreview).not.toHaveBeenCalledTimes(1)
      expect(ToolPreview).not.toHaveBeenCalledTimes(1)
    })
  })
})
