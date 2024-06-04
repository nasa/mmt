import React from 'react'

import { MockedProvider } from '@apollo/client/testing'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import AuthContext from '@/js/context/AuthContext'

import { GET_PERMISSION_COLLECTIONS } from '@/js/operations/queries/getPermissionCollections'

import CollectionSelector from '../CollectionSelector'

const setup = (formData = []) => {
  const user = userEvent.setup()

  const props = {
    onChange: vi.fn(),
    formData
  }

  render(
    <AuthContext.Provider value={
      {
        token: 'mock-jwt'
      }
    }
    >
      <MockedProvider mocks={
        [{
          request: {
            query: GET_PERMISSION_COLLECTIONS,
            variables: {}
          },
          result: {
            data: {
              collections: {
                items: [
                  {
                    conceptId: 'C1200444618-MMT_2',
                    directDistributionInformation: {
                      region: 'us-east-2',
                      s3BucketAndObjectPrefixNames: [
                        's3://example1',
                        's3://example2',
                        'prefix_bucket/*'
                      ],
                      s3CredentialsApiEndpoint: 'https://example.org',
                      s3CredentialsApiDocumentationUrl: 'https://example.org'
                    },
                    shortName: 'Collection 1',
                    provider: 'MMT_2',
                    entryTitle: 'Mock title of collection 1',
                    __typename: 'Collection'
                  },
                  {
                    conceptId: 'C1200482349-MMT_2',
                    directDistributionInformation: null,
                    shortName: 'Collection 2',
                    provider: 'MMT_2',
                    entryTitle: 'Mock title of collection 2',
                    __typename: 'Collection'
                  }
                ],
                __typename: 'CollectionList'
              }
            }
          }
        }]
      }
      >
        <CollectionSelector {...props} />
      </MockedProvider>
    </AuthContext.Provider>
  )

  return {
    props,
    user
  }
}

describe('CollectionSelector', () => {
  describe('when adding item to selected collection', () => {
    test('should add the selected collection and calls onChange', async () => {
      const { user, props } = setup()
      await waitForResponse()

      const nameField = screen.getByText('Collection 1 | Mock title of collection 1')
      await user.click(nameField)

      const addIcon = screen.getByRole('button', { name: '+ icon' })
      await user.click(addIcon)

      expect(screen.getByText('Showing selected 1 items')).toBeInTheDocument()

      expect(props.onChange).toHaveBeenCalledTimes(1)
      expect(props.onChange).toHaveBeenCalledWith([
        {
          __typename: 'Collection',
          conceptId: 'C1200444618-MMT_2',
          directDistributionInformation: {
            region: 'us-east-2',
            s3BucketAndObjectPrefixNames: [
              's3://example1',
              's3://example2',
              'prefix_bucket/*'
            ],
            s3CredentialsApiDocumentationUrl: 'https://example.org',
            s3CredentialsApiEndpoint: 'https://example.org'
          },
          entryTitle: 'Mock title of collection 1',
          provider: 'MMT_2',
          shortName: 'Collection 1'
        }
      ])
    })
  })

  describe('when removing a selected item', () => {
    test('should move the item back to available and calls onChange', async () => {
      const { user, props } = setup()
      await waitForResponse()

      const nameField = screen.getByText('Collection 1 | Mock title of collection 1')
      await user.click(nameField)

      const addIcon = screen.getByRole('button', { name: '+ icon' })
      await user.click(addIcon)

      const selectedField = screen.getAllByText('Collection 1 | Mock title of collection 1')
      await user.click(selectedField[1])

      const minusIcon = screen.getByRole('button', { name: '- icon' })
      await user.click(minusIcon)

      expect(screen.getByText('Showing selected 0 items')).toBeInTheDocument()

      expect(props.onChange).toHaveBeenCalledTimes(1)
      expect(props.onChange).toHaveBeenCalledWith([
        {
          __typename: 'Collection',
          conceptId: 'C1200444618-MMT_2',
          directDistributionInformation: {
            region: 'us-east-2',
            s3BucketAndObjectPrefixNames: [
              's3://example1',
              's3://example2',
              'prefix_bucket/*'
            ],
            s3CredentialsApiDocumentationUrl: 'https://example.org',
            s3CredentialsApiEndpoint: 'https://example.org'
          },
          entryTitle: 'Mock title of collection 1',
          provider: 'MMT_2',
          shortName: 'Collection 1'
        }
      ])
    })
  })

  describe('when removing all selected items', () => {
    test('should remove all selected items and calls onChange', async () => {
      const { user, props } = setup()
      await waitForResponse()

      const nameField1 = screen.getByText('Collection 1 | Mock title of collection 1')
      await user.click(nameField1)

      const addIcon = screen.getByRole('button', { name: '+ icon' })

      await user.click(addIcon)

      const nameField2 = screen.getByText('Collection 2 | Mock title of collection 2')
      await user.click(nameField2)

      await user.click(addIcon)

      expect(screen.getByText('Showing selected 2 items')).toBeInTheDocument()

      const trashIcon = screen.getByRole('button', { name: 'trash icon' })
      await user.click(trashIcon)

      expect(screen.getByText('Showing selected 0 items')).toBeInTheDocument()

      expect(props.onChange).toHaveBeenCalledWith([])
    })
  })

  describe('when searching for available collection', () => {
    test('should call cmr with filtered data', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          items: [{
            meta: {
              'concept-id': 'C1200444618-MMT_2',
              'provider-id': 'MMT_2'
            },
            umm: {
              shortName: 'Collection 1'
            }
          }]
        })
      })

      const { user } = setup()
      await waitForResponse()

      const searchField = screen.getByPlaceholderText('Search Available...')

      await user.type(searchField, 'Collection 1')

      expect(screen.getByText('Showing 1 items')).toBeInTheDocument()
    })
  })

  describe('when searching for selected collection', () => {
    test('should call cmr with filtered data', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          items: [{
            meta: {
              'concept-id': 'C1200444618-MMT_2',
              'provider-id': 'MMT_2'
            },
            umm: {
              shortName: 'Collection 1'
            }
          }]
        })
      })

      const { user } = setup()
      await waitForResponse()

      const searchField = screen.getByPlaceholderText('Search Selected...')

      await user.type(searchField, 'Collection 1')

      expect(screen.getByText('Showing selected 0 items')).toBeInTheDocument()
    })
  })

  describe('when searching for selected collection', () => {
    test('should call cmr with filtered data', async () => {
      setup([
        {
          conceptId: 'C1200450598-MMT_2',
          entryTitle: 'Collection 1 title',
          shortName: 'Collection 1'
        },
        {
          conceptId: 'C1200427406-MMT_2',
          entryTitle: 'Collection 2 title',
          shortName: 'Collection 2'
        }
      ])

      await waitForResponse()

      expect(screen.getByText('Collection 1 | Collection 1 title')).toBeInTheDocument()
      expect(screen.getByText('Collection 2 | Collection 2 title')).toBeInTheDocument()

      expect(screen.getByText('Showing selected 2 items')).toBeInTheDocument()
    })
  })
})
