import React, { Suspense } from 'react'

import { MockedProvider } from '@apollo/client/testing'

import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { GET_PERMISSION_COLLECTIONS } from '@/js/operations/queries/getPermissionCollections'

import CollectionSelector from '../CollectionSelector'

const setup = ({
  additionalMocks = [],
  formData = {}
}) => {
  const user = userEvent.setup()

  const props = {
    onChange: vi.fn(),
    formData
  }

  render(
    <MockedProvider mocks={
      [{
        request: {
          query: GET_PERMISSION_COLLECTIONS,
          variables: {
            params: {
              limit: 100
            }
          }
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
      }, ...additionalMocks]
    }
    >
      <Suspense>
        <CollectionSelector {...props} />
      </Suspense>
    </MockedProvider>

  )

  return {
    props,
    user
  }
}

describe('CollectionSelector', () => {
  describe('when adding item to selected collection', () => {
    test('should add the selected collection and calls onChange', async () => {
      const { user, props } = setup({})

      const nameField = await screen.findByText('Collection 1 | Mock title of collection 1')
      await user.click(nameField)

      const addIcon = screen.getByRole('button', { name: 'plus icon' })
      await user.click(addIcon)

      expect(screen.getByText('Showing selected 1 items')).toBeInTheDocument()

      expect(props.onChange).toHaveBeenCalledTimes(1)
      expect(props.onChange).toHaveBeenCalledWith({
        'C1200444618-MMT_2': {
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
      })
    })
  })

  describe('when removing a selected item', () => {
    test('should move the item back to available and calls onChange', async () => {
      const { user, props } = setup({})

      const nameField = await screen.findByLabelText('Collection 1 | Mock title of collection 1')

      // Selects the available option
      await user.click(nameField)

      const addIcon = screen.getByRole('button', { name: 'plus icon' })
      await user.click(addIcon)

      const selectedField = await screen.findByLabelText('Selected Collection 1 | Mock title of collection 1')

      await user.click(selectedField)
      await waitFor(() => {
        expect(nameField).toHaveClass('collection-selector__list-group-item d-flex justify-content-between align-items-center px-3 py-2 collection-selector__list-group-item--selected')
      })

      await user.click(selectedField)

      await waitFor(() => {
        expect(nameField).toHaveClass('collection-selector__list-group-item d-flex justify-content-between align-items-center px-3 py-2 collection-selector__list-group-item--selected')
      })

      await user.click(selectedField)

      const minusIcon = screen.getByRole('button', { name: 'minus icon' })

      await user.click(minusIcon)

      expect(screen.getByText('Showing selected 0 items')).toBeInTheDocument()

      expect(props.onChange).toHaveBeenCalledTimes(2)
      expect(props.onChange).toHaveBeenCalledWith({
        'C1200444618-MMT_2': {
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
      })

      // Tests selecting and unselecting available items
      await user.click(nameField)

      await waitFor(() => {
        expect(nameField).toHaveClass('collection-selector__list-group-item d-flex justify-content-between align-items-center px-3 py-2 collection-selector__list-group-item--available')
      })

      await user.click(nameField)

      await waitFor(() => {
        expect(nameField).not.toHaveClass('collection-selector__list-group-item d-flex justify-content-between align-items-center px-3 py-2 collection-selector__list-group-item--available')
      })

      await user.click(nameField)

      // Tests selecting and unselecting the selected option
      await user.click(selectedField[1])
      await user.click(selectedField[1])
    })
  })

  describe('when removing all selected items', () => {
    test('should remove all selected items and calls onChange', async () => {
      const { user, props } = setup({})

      const nameField1 = await screen.findByText('Collection 1 | Mock title of collection 1')
      await user.click(nameField1)

      const addIcon = screen.getByRole('button', { name: 'plus icon' })

      await user.click(addIcon)

      const nameField2 = screen.getByText('Collection 2 | Mock title of collection 2')
      await user.click(nameField2)

      await user.click(addIcon)

      expect(screen.getByText('Showing selected 2 items')).toBeInTheDocument()

      const trashIcon = screen.getByRole('button', { name: 'trash icon' })
      await user.click(trashIcon)

      expect(screen.getByText('Showing selected 0 items')).toBeInTheDocument()

      expect(props.onChange).toHaveBeenCalledWith({})
    })
  })

  describe('when searching for available collection', () => {
    test('should call cmr with filtered data', async () => {
      const { user } = setup({
        additionalMocks: [{
          request: {
            query: GET_PERMISSION_COLLECTIONS,
            variables: {
              params: {
                options: { shortName: { pattern: true } },
                shortName: 'C*',
                limit: 100
              }
            }
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
                  }
                ],
                __typename: 'CollectionList'
              }
            }
          }
        }]
      })

      const searchField = await screen.findByPlaceholderText('Search Available...')

      await user.type(searchField, 'C')

      expect(await screen.findByText('Showing 1 items')).toBeInTheDocument()
    })
  })

  describe('when the user presses enter key', () => {
    test('prevents Enter key default action in search input', async () => {
      const { user } = setup({})

      const availableSearchField = await screen.findByPlaceholderText('Search Available...')

      await user.type(availableSearchField, '{enter}')

      expect(availableSearchField).toHaveValue('')

      const selectedSearchField = await screen.findByPlaceholderText('Search Selected...')

      await user.type(selectedSearchField, '{enter}')

      expect(selectedSearchField).toHaveValue('')
    })
  })

  describe('when searching for selected collection', () => {
    test('should call cmr with filtered data', async () => {
      const { user } = setup({
        additionalMocks: [{
          request: {
            query: GET_PERMISSION_COLLECTIONS,
            variables: {
              params: {
                keyword: 'Col',
                limit: 100
              }
            }
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
                  }
                ],
                __typename: 'CollectionList'
              }
            }
          }
        }]
      })

      const searchField = await screen.findByPlaceholderText('Search Selected...')

      await user.type(searchField, 'Collection 1')

      expect(screen.getByText('Showing selected 0 items')).toBeInTheDocument()
    })
  })

  describe('when formData has saved collections', () => {
    test('render the saved collections', async () => {
      setup(
        {
          formData: {
            'C1200450598-MMT_2': {
              conceptId: 'C1200450598-MMT_2',
              entryTitle: 'Collection 1 title',
              shortName: 'Collection 1'
            },
            'C1200427406-MMT_2': {
              conceptId: 'C1200427406-MMT_2',
              entryTitle: 'Collection 2 title',
              shortName: 'Collection 2'
            }
          }
        }
      )

      expect(await screen.findByText('Collection 1 | Collection 1 title')).toBeInTheDocument()
      expect(screen.getByText('Collection 2 | Collection 2 title')).toBeInTheDocument()

      expect(screen.getByText('Showing selected 2 items')).toBeInTheDocument()
    })
  })
})
