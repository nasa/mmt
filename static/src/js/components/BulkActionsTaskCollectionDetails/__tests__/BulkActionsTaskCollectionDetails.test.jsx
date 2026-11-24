import React from 'react'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import userEvent from '@testing-library/user-event'

import {
  GET_COLLECTIONS_SHORT_NAME_VERSION
} from '@/js/operations/queries/getCollectionsShortNameVersion'

import BulkActionsTaskCollectionDetails from '../BulkActionsTaskCollectionDetails'

const buildCollectionStatus = (index, overrides = {}) => ({
  conceptId: `C${index}-MMT_2`,
  status: 'UPDATED',
  statusMessage: null,
  ...overrides
})

const buildCollectionItem = ({ conceptId, shortName, version }) => ({
  conceptId,
  shortName,
  version
})

const buildCollectionsMock = (conceptIds, partialItems) => ({
  request: {
    query: GET_COLLECTIONS_SHORT_NAME_VERSION,
    variables: {
      params: {
        conceptId: conceptIds,
        limit: conceptIds.length
      }
    }
  },
  result: {
    data: {
      collections: {
        items: partialItems.map(buildCollectionItem)
      }
    }
  }
})

const setup = ({
  conceptType = 'collections',
  collectionStatuses = [],
  mocks = []
} = {}) => {
  const user = userEvent.setup()

  render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter>
        <BulkActionsTaskCollectionDetails
          conceptType={conceptType}
          collectionStatuses={collectionStatuses}
        />
      </MemoryRouter>
    </MockedProvider>
  )

  return { user }
}

describe('BulkActionsTaskCollectionDetails component', () => {
  test('shows a message when there are no collections', () => {
    setup({ collectionStatuses: [] })

    expect(screen.getByText('No collections were part of this task.')).toBeInTheDocument()
  })

  test('renders a row per collection, with shortName/version looked up', async () => {
    const collectionStatuses = [
      buildCollectionStatus(1, { status: 'UPDATED' }),
      buildCollectionStatus(2, {
        status: 'FAILED',
        statusMessage: 'Validation error'
      })
    ]

    const mocks = [
      buildCollectionsMock(
        ['C1-MMT_2', 'C2-MMT_2'],
        [
          {
            conceptId: 'C1-MMT_2',
            shortName: 'ShortName1',
            version: '1'
          },
          {
            conceptId: 'C2-MMT_2',
            shortName: 'ShortName2',
            version: '2'
          }
        ]
      )
    ]

    setup({
      collectionStatuses,
      mocks
    })

    expect(await screen.findByText('ShortName1')).toBeInTheDocument()
    expect(screen.getByText('ShortName2')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'C1-MMT_2' })).toHaveAttribute('href', '/collections/C1-MMT_2')
    expect(screen.getByText('UPDATED')).toBeInTheDocument()
    expect(screen.getByText('FAILED')).toBeInTheDocument()
  })

  test('still shows a row for a conceptId GET_COLLECTIONS_SHORT_NAME_VERSION does not return', async () => {
    const collectionStatuses = [buildCollectionStatus(1)]
    const mocks = [buildCollectionsMock(['C1-MMT_2'], [])]

    setup({
      collectionStatuses,
      mocks
    })

    expect(await screen.findByRole('link', { name: 'C1-MMT_2' })).toBeInTheDocument()
    expect(screen.getByText('UPDATED')).toBeInTheDocument()
  })

  test('shows an error message instead of treating a failed lookup as empty', async () => {
    const collectionStatuses = [buildCollectionStatus(1)]
    const errorMock = {
      request: {
        query: GET_COLLECTIONS_SHORT_NAME_VERSION,
        variables: {
          params: {
            conceptId: ['C1-MMT_2'],
            limit: 1
          }
        }
      },
      error: new Error('An error occurred')
    }

    setup({
      collectionStatuses,
      mocks: [errorMock]
    })

    expect(await screen.findByText(/An error occurred/)).toBeInTheDocument()
    expect(screen.getByText(/Try refreshing the page/)).toBeInTheDocument()
  })

  describe('when a row has a statusMessage', () => {
    const collectionStatuses = [
      buildCollectionStatus(1, {
        status: 'FAILED',
        statusMessage: 'Bad schema'
      }),
      buildCollectionStatus(2, {
        status: 'SKIPPED',
        statusMessage: 'Already up to date'
      })
    ]

    const mocks = [
      buildCollectionsMock(
        ['C1-MMT_2', 'C2-MMT_2'],
        [
          {
            conceptId: 'C1-MMT_2',
            shortName: 'ShortName1',
            version: '1'
          },
          {
            conceptId: 'C2-MMT_2',
            shortName: 'ShortName2',
            version: '1'
          }
        ]
      )
    ]

    test('toggles a FAILED row open/closed, with a "Validation Error" heading', async () => {
      const { user } = setup({
        collectionStatuses,
        mocks
      })

      const viewErrorButtons = await screen.findAllByRole('button', { name: 'View Error' })

      expect(viewErrorButtons).toHaveLength(2)
      expect(screen.queryByText('Bad schema')).not.toBeInTheDocument()

      await user.click(viewErrorButtons[0])

      expect(screen.getByText('Validation Error')).toBeInTheDocument()
      expect(screen.getByText('Bad schema')).toBeInTheDocument()

      const hideErrorButton = screen.getByRole('button', { name: 'Hide Error' })
      await user.click(hideErrorButton)

      expect(screen.queryByText('Bad schema')).not.toBeInTheDocument()
    })

    test('toggles a SKIPPED row open without a "Validation Error" heading', async () => {
      const { user } = setup({
        collectionStatuses,
        mocks
      })

      const viewErrorButtons = await screen.findAllByRole('button', { name: 'View Error' })

      await user.click(viewErrorButtons[1])

      expect(screen.getByText('Already up to date')).toBeInTheDocument()
      // SKIPPED rows don't get the "Validation Error" heading -- only FAILED does.
      expect(screen.queryByText('Validation Error')).not.toBeInTheDocument()
    })

    test('does not render a View Error button when there is no statusMessage', async () => {
      const unfailedCollectionStatuses = [buildCollectionStatus(1, { statusMessage: null })]
      const unfailedMocks = [buildCollectionsMock(['C1-MMT_2'], [{
        conceptId: 'C1-MMT_2',
        shortName: 'ShortName1',
        version: '1'
      }])]

      setup({
        collectionStatuses: unfailedCollectionStatuses,
        mocks: unfailedMocks
      })

      expect(await screen.findByText('ShortName1')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'View Error' })).not.toBeInTheDocument()
    })
  })

  describe('when there are more than 25 collections', () => {
    test('shows 25 per page and pages to the rest', async () => {
      const indices = Array.from({ length: 27 }, (_, index) => index + 1)
      const collectionStatuses = indices.map((index) => buildCollectionStatus(index))

      const conceptIdsPage1 = indices.slice(0, 25).map((index) => `C${index}-MMT_2`)
      const conceptIdsPage2 = indices.slice(25).map((index) => `C${index}-MMT_2`)

      const mocks = [
        buildCollectionsMock(
          conceptIdsPage1,
          conceptIdsPage1.map((conceptId, index) => ({
            conceptId,
            shortName: `ShortName${index + 1}`,
            version: '1'
          }))
        ),
        buildCollectionsMock(
          conceptIdsPage2,
          conceptIdsPage2.map((conceptId, index) => ({
            conceptId,
            shortName: `ShortName${index + 26}`,
            version: '1'
          }))
        )
      ]

      const { user } = setup({
        collectionStatuses,
        mocks
      })

      expect(await screen.findByText('ShortName1')).toBeInTheDocument()
      expect(screen.getByText('ShortName25')).toBeInTheDocument()
      expect(screen.queryByText('ShortName26')).not.toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Goto Next Page' }))

      expect(await screen.findByText('ShortName26')).toBeInTheDocument()
      expect(screen.getByText('ShortName27')).toBeInTheDocument()
      expect(screen.queryByText('ShortName1')).not.toBeInTheDocument()
    })
  })
})
