import React, { useState } from 'react'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import userEvent from '@testing-library/user-event'

import errorLogger from '@/js/utils/errorLogger'

import { GET_COLLECTIONS } from '@/js/operations/queries/getCollections'
import { GET_TARGET_COLLECTION } from '@/js/operations/queries/getTargetCollection'

import SaveAsDraftToExistingCollectionModal from '../SaveAsDraftToExistingCollectionModal'

vi.mock('@/js/utils/errorLogger')

const mockMetadata = {
  EntryTitle: 'Mock Staged Collection',
  ShortName: 'Mock Short Name',
  Version: '1'
}

const setup = ({
  mocks = [],
  metadata = mockMetadata,
  conceptType = 'Collection'
} = {}) => {
  const user = userEvent.setup()
  const onConfirm = vi.fn()

  // A stateful wrapper mirrors how a real caller wires `show`/`toggleModal`,
  // so tests can assert the modal actually closes itself.
  const Harness = () => {
    const [show, setShow] = useState(true)

    return (
      <MockedProvider mocks={mocks}>
        <SaveAsDraftToExistingCollectionModal
          show={show}
          toggleModal={setShow}
          metadata={metadata}
          conceptType={conceptType}
          onConfirm={onConfirm}
        />
      </MockedProvider>
    )
  }

  render(<Harness />)

  return {
    user,
    onConfirm
  }
}

describe('SaveAsDraftToExistingCollectionModal', () => {
  describe('when exactly one matching collection is found', () => {
    test('shows a diff and calls onConfirm with the existing nativeId/providerId on confirm', async () => {
      const { user, onConfirm } = setup({
        mocks: [
          {
            request: {
              query: GET_COLLECTIONS,
              variables: { params: { shortName: 'Mock Short Name' } }
            },
            result: {
              data: {
                collections: {
                  count: 1,
                  items: [{
                    conceptId: 'C1000000-MMT_2',
                    shortName: 'Mock Short Name',
                    version: '1',
                    title: 'Existing Published Collection',
                    provider: 'MMT_2',
                    entryTitle: 'Existing Published Collection',
                    revisionId: '3',
                    granules: null,
                    tagDefinitions: null,
                    tags: null,
                    revisionDate: '2024-01-01T00:00:00.000Z'
                  }]
                }
              }
            }
          },
          {
            request: {
              query: GET_TARGET_COLLECTION,
              variables: { params: { conceptId: 'C1000000-MMT_2' } }
            },
            result: {
              data: {
                collection: {
                  nativeId: 'existing-native-id',
                  providerId: 'MMT_2',
                  ummMetadata: {
                    EntryTitle: 'Existing Published Collection',
                    ShortName: 'Mock Short Name',
                    Version: '1'
                  }
                }
              }
            }
          }
        ]
      })

      const confirmButton = await screen.findByRole('button', { name: 'Save as Draft' })
      await user.click(confirmButton)

      expect(onConfirm).toHaveBeenCalledTimes(1)
      expect(onConfirm).toHaveBeenCalledWith('existing-native-id', 'MMT_2')
    })
  })

  describe('when the existing published collection matches the staged metadata exactly', () => {
    test('shows a no differences message instead of the diff viewer and still allows confirming', async () => {
      const { user, onConfirm } = setup({
        mocks: [
          {
            request: {
              query: GET_COLLECTIONS,
              variables: { params: { shortName: 'Mock Short Name' } }
            },
            result: {
              data: {
                collections: {
                  count: 1,
                  items: [{
                    conceptId: 'C1000000-MMT_2',
                    shortName: 'Mock Short Name',
                    version: '1',
                    title: 'Mock Staged Collection',
                    provider: 'MMT_2',
                    entryTitle: 'Mock Staged Collection',
                    revisionId: '3',
                    granules: null,
                    tagDefinitions: null,
                    tags: null,
                    revisionDate: '2024-01-01T00:00:00.000Z'
                  }]
                }
              }
            }
          },
          {
            request: {
              query: GET_TARGET_COLLECTION,
              variables: { params: { conceptId: 'C1000000-MMT_2' } }
            },
            result: {
              data: {
                collection: {
                  nativeId: 'existing-native-id',
                  providerId: 'MMT_2',
                  ummMetadata: mockMetadata
                }
              }
            }
          }
        ]
      })

      expect(await screen.findByText(/No differences were found between the existing published collection and the staged metadata/)).toBeInTheDocument()
      expect(screen.queryByText(/Review the differences between/)).not.toBeInTheDocument()

      const confirmButton = screen.getByRole('button', { name: 'Save as Draft' })
      await user.click(confirmButton)

      expect(onConfirm).toHaveBeenCalledWith('existing-native-id', 'MMT_2')
    })
  })

  describe('when no matching collection is found', () => {
    test('shows a message explaining no match was found', async () => {
      setup({
        mocks: [
          {
            request: {
              query: GET_COLLECTIONS,
              variables: { params: { shortName: 'Mock Short Name' } }
            },
            result: {
              data: {
                collections: {
                  count: 0,
                  items: []
                }
              }
            }
          }
        ]
      })

      expect(await screen.findByText(/No published collection was found with ShortName "Mock Short Name"/)).toBeInTheDocument()
    })
  })

  describe('when more than one matching collection is found', () => {
    test('lets the user choose which collection to target before showing the diff', async () => {
      const { user, onConfirm } = setup({
        mocks: [
          {
            request: {
              query: GET_COLLECTIONS,
              variables: { params: { shortName: 'Mock Short Name' } }
            },
            result: {
              data: {
                collections: {
                  count: 2,
                  items: [
                    {
                      conceptId: 'C1000000-MMT_1',
                      shortName: 'Mock Short Name',
                      version: '1',
                      title: 'First Provider Collection',
                      provider: 'MMT_1',
                      entryTitle: 'First Provider Collection',
                      revisionId: '1',
                      granules: null,
                      tagDefinitions: null,
                      tags: null,
                      revisionDate: '2024-01-01T00:00:00.000Z'
                    },
                    {
                      conceptId: 'C1000000-MMT_2',
                      shortName: 'Mock Short Name',
                      version: '1',
                      title: 'Second Provider Collection',
                      provider: 'MMT_2',
                      entryTitle: 'Second Provider Collection',
                      revisionId: '1',
                      granules: null,
                      tagDefinitions: null,
                      tags: null,
                      revisionDate: '2024-01-01T00:00:00.000Z'
                    }
                  ]
                }
              }
            }
          },
          {
            request: {
              query: GET_TARGET_COLLECTION,
              variables: { params: { conceptId: 'C1000000-MMT_2' } }
            },
            result: {
              data: {
                collection: {
                  nativeId: 'second-native-id',
                  providerId: 'MMT_2',
                  ummMetadata: {
                    EntryTitle: 'Second Provider Collection',
                    ShortName: 'Mock Short Name',
                    Version: '1'
                  }
                }
              }
            }
          }
        ]
      })

      const secondMatch = await screen.findByLabelText(/Second Provider Collection/)
      await user.click(secondMatch)

      const continueButton = screen.getByRole('button', { name: 'Continue' })
      await user.click(continueButton)

      const confirmButton = await screen.findByRole('button', { name: 'Save as Draft' })
      await user.click(confirmButton)

      expect(onConfirm).toHaveBeenCalledWith('second-native-id', 'MMT_2')
    })
  })

  describe('when searching for a matching collection results in an error', () => {
    test('shows an error message and calls errorLogger', async () => {
      setup({
        mocks: [
          {
            request: {
              query: GET_COLLECTIONS,
              variables: { params: { shortName: 'Mock Short Name' } }
            },
            error: new Error('An error occurred')
          }
        ]
      })

      expect(await screen.findByText('An error occurred')).toBeInTheDocument()
      expect(errorLogger).toHaveBeenCalledWith(new Error('An error occurred'), 'SaveAsDraftToExistingCollectionModal: getCollections')
    })
  })

  describe('when the staged metadata has no ShortName', () => {
    test('shows an error message without searching for a matching collection', async () => {
      // No GET_COLLECTIONS mock is registered -- searching without a ShortName
      // filter would throw an "unmatched mock" error, so registering none here
      // also proves the guard prevents the query from ever being made.
      setup({
        metadata: {
          EntryTitle: 'Mock Staged Collection',
          Version: '1'
        }
      })

      expect(await screen.findByText('The staged metadata is missing a ShortName, so a matching collection could not be searched for.')).toBeInTheDocument()
    })
  })

  describe('when fetching the matching collection results in an error', () => {
    test('shows an error message and calls errorLogger', async () => {
      setup({
        mocks: [
          {
            request: {
              query: GET_COLLECTIONS,
              variables: { params: { shortName: 'Mock Short Name' } }
            },
            result: {
              data: {
                collections: {
                  count: 1,
                  items: [{
                    conceptId: 'C1000000-MMT_2',
                    shortName: 'Mock Short Name',
                    version: '1',
                    title: 'Existing Published Collection',
                    provider: 'MMT_2',
                    entryTitle: 'Existing Published Collection',
                    revisionId: '3',
                    granules: null,
                    tagDefinitions: null,
                    tags: null,
                    revisionDate: '2024-01-01T00:00:00.000Z'
                  }]
                }
              }
            }
          },
          {
            request: {
              query: GET_TARGET_COLLECTION,
              variables: { params: { conceptId: 'C1000000-MMT_2' } }
            },
            error: new Error('An error occurred')
          }
        ]
      })

      expect(await screen.findByText('An error occurred')).toBeInTheDocument()
      expect(errorLogger).toHaveBeenCalledWith(new Error('An error occurred'), 'SaveAsDraftToExistingCollectionModal: getCollection')
    })
  })

  describe('when the matching collection cannot be retrieved', () => {
    test('shows an error message', async () => {
      setup({
        mocks: [
          {
            request: {
              query: GET_COLLECTIONS,
              variables: { params: { shortName: 'Mock Short Name' } }
            },
            result: {
              data: {
                collections: {
                  count: 1,
                  items: [{
                    conceptId: 'C1000000-MMT_2',
                    shortName: 'Mock Short Name',
                    version: '1',
                    title: 'Existing Published Collection',
                    provider: 'MMT_2',
                    entryTitle: 'Existing Published Collection',
                    revisionId: '3',
                    granules: null,
                    tagDefinitions: null,
                    tags: null,
                    revisionDate: '2024-01-01T00:00:00.000Z'
                  }]
                }
              }
            }
          },
          {
            request: {
              query: GET_TARGET_COLLECTION,
              variables: { params: { conceptId: 'C1000000-MMT_2' } }
            },
            result: {
              data: {
                collection: null
              }
            }
          }
        ]
      })

      expect(await screen.findByText('The matching collection could not be retrieved.')).toBeInTheDocument()
    })
  })

  describe('when clicking Close after no match is found', () => {
    test('closes the modal', async () => {
      const { user } = setup({
        mocks: [
          {
            request: {
              query: GET_COLLECTIONS,
              variables: { params: { shortName: 'Mock Short Name' } }
            },
            result: {
              data: {
                collections: {
                  count: 0,
                  items: []
                }
              }
            }
          }
        ]
      })

      await screen.findByText(/No published collection was found with ShortName "Mock Short Name"/)

      const closeButton = screen.getByRole('button', { name: 'Close' })
      await user.click(closeButton)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('when clicking Cancel while choosing among multiple matches', () => {
    test('closes the modal', async () => {
      const { user } = setup({
        mocks: [
          {
            request: {
              query: GET_COLLECTIONS,
              variables: { params: { shortName: 'Mock Short Name' } }
            },
            result: {
              data: {
                collections: {
                  count: 2,
                  items: [
                    {
                      conceptId: 'C1000000-MMT_1',
                      shortName: 'Mock Short Name',
                      version: '1',
                      title: 'First Provider Collection',
                      provider: 'MMT_1',
                      entryTitle: 'First Provider Collection',
                      revisionId: '1',
                      granules: null,
                      tagDefinitions: null,
                      tags: null,
                      revisionDate: '2024-01-01T00:00:00.000Z'
                    },
                    {
                      conceptId: 'C1000000-MMT_2',
                      shortName: 'Mock Short Name',
                      version: '1',
                      title: 'Second Provider Collection',
                      provider: 'MMT_2',
                      entryTitle: 'Second Provider Collection',
                      revisionId: '1',
                      granules: null,
                      tagDefinitions: null,
                      tags: null,
                      revisionDate: '2024-01-01T00:00:00.000Z'
                    }
                  ]
                }
              }
            }
          }
        ]
      })

      await screen.findByLabelText(/Second Provider Collection/)

      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      await user.click(cancelButton)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('when clicking Cancel on the diff view', () => {
    test('closes the modal without confirming', async () => {
      const { user, onConfirm } = setup({
        mocks: [
          {
            request: {
              query: GET_COLLECTIONS,
              variables: { params: { shortName: 'Mock Short Name' } }
            },
            result: {
              data: {
                collections: {
                  count: 1,
                  items: [{
                    conceptId: 'C1000000-MMT_2',
                    shortName: 'Mock Short Name',
                    version: '1',
                    title: 'Existing Published Collection',
                    provider: 'MMT_2',
                    entryTitle: 'Existing Published Collection',
                    revisionId: '3',
                    granules: null,
                    tagDefinitions: null,
                    tags: null,
                    revisionDate: '2024-01-01T00:00:00.000Z'
                  }]
                }
              }
            }
          },
          {
            request: {
              query: GET_TARGET_COLLECTION,
              variables: { params: { conceptId: 'C1000000-MMT_2' } }
            },
            result: {
              data: {
                collection: {
                  nativeId: 'existing-native-id',
                  providerId: 'MMT_2',
                  ummMetadata: {
                    EntryTitle: 'Existing Published Collection',
                    ShortName: 'Mock Short Name',
                    Version: '1'
                  }
                }
              }
            }
          }
        ]
      })

      const cancelButton = await screen.findByRole('button', { name: 'Cancel' })
      await user.click(cancelButton)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(onConfirm).not.toHaveBeenCalled()
    })
  })

  describe('when closing the modal via the X button once a match is loaded', () => {
    test('closes the modal', async () => {
      const { user } = setup({
        mocks: [
          {
            request: {
              query: GET_COLLECTIONS,
              variables: { params: { shortName: 'Mock Short Name' } }
            },
            result: {
              data: {
                collections: {
                  count: 1,
                  items: [{
                    conceptId: 'C1000000-MMT_2',
                    shortName: 'Mock Short Name',
                    version: '1',
                    title: 'Existing Published Collection',
                    provider: 'MMT_2',
                    entryTitle: 'Existing Published Collection',
                    revisionId: '3',
                    granules: null,
                    tagDefinitions: null,
                    tags: null,
                    revisionDate: '2024-01-01T00:00:00.000Z'
                  }]
                }
              }
            }
          },
          {
            request: {
              query: GET_TARGET_COLLECTION,
              variables: { params: { conceptId: 'C1000000-MMT_2' } }
            },
            result: {
              data: {
                collection: {
                  nativeId: 'existing-native-id',
                  providerId: 'MMT_2',
                  ummMetadata: {
                    EntryTitle: 'Existing Published Collection',
                    ShortName: 'Mock Short Name',
                    Version: '1'
                  }
                }
              }
            }
          }
        ]
      })

      await screen.findByRole('button', { name: 'Save as Draft' })

      const closeIconButton = screen.getByRole('button', { name: 'X icon Close' })
      await user.click(closeIconButton)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('when pressing Escape while still searching for a match', () => {
    test('closes the modal', async () => {
      const { user } = setup({
        mocks: [
          {
            request: {
              query: GET_COLLECTIONS,
              variables: { params: { shortName: 'Mock Short Name' } }
            },
            result: {
              data: {
                collections: {
                  count: 0,
                  items: []
                }
              }
            },
            // Delays resolution so the modal is still in the 'searching' status when Escape is pressed
            delay: 50
          }
        ]
      })

      expect(await screen.findByRole('dialog')).toBeInTheDocument()

      await user.keyboard('{Escape}')

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('while still searching for a match', () => {
    test('shows a Cancel action that closes the modal', async () => {
      const { user } = setup({
        mocks: [
          {
            request: {
              query: GET_COLLECTIONS,
              variables: { params: { shortName: 'Mock Short Name' } }
            },
            result: {
              data: {
                collections: {
                  count: 0,
                  items: []
                }
              }
            },
            // Delays resolution so the modal is still in the 'searching' status when Cancel is clicked
            delay: 50
          }
        ]
      })

      const cancelButton = await screen.findByRole('button', { name: 'Cancel' })
      await user.click(cancelButton)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('while loading the matching collection', () => {
    test('shows a Cancel action that closes the modal', async () => {
      const { user } = setup({
        mocks: [
          {
            request: {
              query: GET_COLLECTIONS,
              variables: { params: { shortName: 'Mock Short Name' } }
            },
            result: {
              data: {
                collections: {
                  count: 1,
                  items: [{
                    conceptId: 'C1000000-MMT_2',
                    shortName: 'Mock Short Name',
                    version: '1',
                    title: 'Existing Published Collection',
                    provider: 'MMT_2',
                    entryTitle: 'Existing Published Collection',
                    revisionId: '3',
                    granules: null,
                    tagDefinitions: null,
                    tags: null,
                    revisionDate: '2024-01-01T00:00:00.000Z'
                  }]
                }
              }
            }
          },
          {
            request: {
              query: GET_TARGET_COLLECTION,
              variables: { params: { conceptId: 'C1000000-MMT_2' } }
            },
            result: {
              data: {
                collection: {
                  nativeId: 'existing-native-id',
                  providerId: 'MMT_2',
                  ummMetadata: {
                    EntryTitle: 'Existing Published Collection',
                    ShortName: 'Mock Short Name',
                    Version: '1'
                  }
                }
              }
            },
            // Delays resolution so the modal is still in the 'loading-target' status when Cancel is clicked
            delay: 50
          }
        ]
      })

      expect(await screen.findByText('Loading the matching collection…')).toBeInTheDocument()

      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      await user.click(cancelButton)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('when the modal is closed while a request is still in flight', () => {
    test('ignores the response once it resolves instead of reopening or showing stale results', async () => {
      const { user, onConfirm } = setup({
        mocks: [
          {
            request: {
              query: GET_COLLECTIONS,
              variables: { params: { shortName: 'Mock Short Name' } }
            },
            result: {
              data: {
                collections: {
                  count: 1,
                  items: [{
                    conceptId: 'C1000000-MMT_2',
                    shortName: 'Mock Short Name',
                    version: '1',
                    title: 'Existing Published Collection',
                    provider: 'MMT_2',
                    entryTitle: 'Existing Published Collection',
                    revisionId: '3',
                    granules: null,
                    tagDefinitions: null,
                    tags: null,
                    revisionDate: '2024-01-01T00:00:00.000Z'
                  }]
                }
              }
            },
            // Resolves after the modal is closed below
            delay: 50
          }
        ]
      })

      const cancelButton = await screen.findByRole('button', { name: 'Cancel' })
      await user.click(cancelButton)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

      // Give the delayed GET_COLLECTIONS response time to resolve after closing
      await new Promise((resolve) => { setTimeout(resolve, 100) })

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(onConfirm).not.toHaveBeenCalled()
    })
  })

  describe('when a conceptType is provided', () => {
    test('uses it in the modal header', async () => {
      setup({
        conceptType: 'Service',
        mocks: [
          {
            request: {
              query: GET_COLLECTIONS,
              variables: { params: { shortName: 'Mock Short Name' } }
            },
            result: {
              data: {
                collections: {
                  count: 0,
                  items: []
                }
              }
            }
          }
        ]
      })

      expect(await screen.findByText('Save as Draft to Existing Service')).toBeInTheDocument()
    })
  })
})
