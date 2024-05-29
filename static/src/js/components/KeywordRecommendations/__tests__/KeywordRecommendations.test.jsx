import React, { useEffect } from 'react'
import {
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import useAppContext from '@/js/hooks/useAppContext'
import AppContextProvider from '@/js/providers/AppContextProvider/AppContextProvider'
import AuthContextProvider from '@/js/providers/AuthContextProvider/AuthContextProvider'
import sendKeywordRecommendationsFeedback from '@/js/utils/sendKeywordRecommendationsFeedback'
import getKeywordRecommendations from '@/js/utils/getKeywordRecommendations'
import errorLogger from '@/js/utils/errorLogger'

import KeywordRecommendations from '../KeywordRecommendations'

vi.mock('@/js/utils/errorLogger')
vi.mock('@/js/utils/getKeywordRecommendations', () => ({
  __esModule: true,
  default: vi.fn(() => (
    {
      uuid: 'b0b399d7-abaf-4bd7-b2bf-5484605ffd97',
      description: 'cloud cover and the ozone',
      recommendations: [
        {
          uuid: '1317aad9-d939-4152-9c30-07be5f193c8b',
          keyword: 'EARTH SCIENCE > ATMOSPHERE > CLOUDS > CLOUD RADIATIVE TRANSFER > CLOUD REFLECTANCE',
          score: 0.8562080264091492,
          yes_count: 0,
          no_count: 0
        },
        {
          uuid: '503c65c1-1cc1-4b8a-acb8-4471994e2666',
          keyword: 'EARTH SCIENCE > ATMOSPHERE > CLOUDS > CLOUD PROPERTIES > CLOUD TOP PRESSURE',
          score: 0.8074768781661987,
          yes_count: 0,
          no_count: 0
        },
        {
          uuid: '8c15cd1c-2655-4a12-8f60-d850d0097632',
          keyword: 'EARTH SCIENCE > ATMOSPHERE > CLOUDS > CLOUD PROPERTIES > CLOUD FREQUENCY',
          score: 0.7583385705947876,
          yes_count: 0,
          no_count: 0
        },
        {
          uuid: 'd106d9b6-f401-455b-82d5-d04aeab5d269',
          keyword: 'EARTH SCIENCE > ATMOSPHERE > CLOUDS > CLOUD PROPERTIES > CLOUD FRACTION',
          score: 0.6599593758583069,
          yes_count: 0,
          no_count: 0
        },
        {
          uuid: '9e734f01-893a-4552-b28c-a89e71414715',
          keyword: 'EARTH SCIENCE > ATMOSPHERE > CLOUDS > CLOUD PROPERTIES > CLOUD HEIGHT',
          score: 0.5061247944831848,
          yes_count: 0,
          no_count: 0
        },
        {
          uuid: 'd5e55c88-f9ba-4fac-8ece-4d1711ab14d7',
          keyword: 'EARTH SCIENCE > ATMOSPHERE > CLOUDS > CLOUD PROPERTIES > CLOUD TOP TEMPERATURE',
          score: 0.4896530508995056,
          yes_count: 0,
          no_count: 0
        },
        {
          uuid: '7927d4d1-a511-4e60-a6ff-ea5d64c8ab93',
          keyword: 'EARTH SCIENCE > ATMOSPHERE > ATMOSPHERIC RADIATION > REFLECTANCE',
          score: 0.44336938858032227,
          yes_count: 0,
          no_count: 0
        },
        {
          uuid: '3da1fc4e-6737-44a3-aadb-8d1b46068495',
          keyword: 'EARTH SCIENCE > ATMOSPHERE > CLOUDS',
          score: 0.3299327492713928,
          yes_count: 0,
          no_count: 0
        }
      ],
      threshold: 0.3,
      forced: false,
      explain: false
    }
  ))
}))

vi.mock('@/js/utils/sendKeywordRecommendationsFeedback')

//
// Mock component is used to mimic the KeywordPicker component where you can
// add a keyword outside of the KeywordRecommender.
//
// Also the Keyword Recommender should only retrieve recommendations if
// there are no science keywords already selected during the initial
// mounting of the component.   This mock component is also used to mimic this
// behavior.
//

// eslint-disable-next-line react/prop-types
const MockComponent = ({ draft: mockDraft }) => {
  const {
    draft, setDraft
  } = useAppContext()
  const { ummMetadata } = draft || {}
  const { Abstract: abstract } = ummMetadata || {}

  // Not really a way to initialize AppContextProvider for testing,
  // so using this mock component
  useEffect(() => {
    setDraft(mockDraft)
  }, [])

  // Used to add a test keyword (mimic's what keyword picker would do)
  const addKeyword = () => {
    const { ScienceKeywords: newKeywords = [] } = ummMetadata
    newKeywords.push(
      {
        Category: 'EARTH SCIENCE',
        Topic: 'ATMOSPHERE',
        Term: 'CLOUDS',
        VariableLevel1: 'CLOUD PROPERTIES',
        VariableLevel2: 'CLOUD TOP PRESSURE',
        VariableLevel3: 'NEW KEYWORD'
      }
    )

    const updatedDraft = { ...draft }
    updatedDraft.ummMetadata.ScienceKeywords = newKeywords
    setDraft(updatedDraft)
  }

  return (

    <div>
      <div>
        <button
          type="button"
          onClick={
            () => {
              addKeyword()
            }
          }
        >
          Add New Keyword
        </button>
      </div>
      <div>
        { // Mounts the component once we have a abstract
          abstract && (
            <KeywordRecommendations
              formData={draft.ummMetadata.ScienceKeywords}
              onChange={
                (newKeywords) => {
                  const updatedDraft = { ...draft }
                  updatedDraft.ummMetadata.ScienceKeywords = newKeywords
                  setDraft(updatedDraft)
                }
              }
            />
          )
        }
      </div>
    </div>
  )
}

const setup = ({ draft }) => {
  const user = userEvent.setup()
  const { unmount, container } = render(
    <AuthContextProvider>
      <AppContextProvider>
        <MockComponent draft={draft} />
      </AppContextProvider>
    </AuthContextProvider>
  )

  return {
    container,
    user,
    unmount
  }
}

describe('KeywordRecommendations component', () => {
  describe('when draft contains a abstract', () => {
    describe('when draft has NO science keywords', () => {
      test('renders a list of recommended keywords', async () => {
        const draft = {
          ummMetadata: {
            Abstract: 'cloud cover and the ozone'
          }
        }
        setup({ draft })

        await waitFor(() => {
          expect(screen.getAllByRole('listitem').length).toBe(8)
        })

        const keywords = screen.getAllByRole('listitem')
        expect(keywords[0]).toHaveTextContent('EARTH SCIENCE > ATMOSPHERE > CLOUDS > CLOUD RADIATIVE TRANSFER > CLOUD REFLECTANCE Recommended')
        expect(keywords[1]).toHaveTextContent('EARTH SCIENCE > ATMOSPHERE > CLOUDS > CLOUD PROPERTIES > CLOUD TOP PRESSURE Recommended')
        expect(keywords[2]).toHaveTextContent('EARTH SCIENCE > ATMOSPHERE > CLOUDS > CLOUD PROPERTIES > CLOUD FREQUENCY Recommended')
        expect(keywords[3]).toHaveTextContent('EARTH SCIENCE > ATMOSPHERE > CLOUDS > CLOUD PROPERTIES > CLOUD FRACTION Recommended')
        expect(keywords[4]).toHaveTextContent('EARTH SCIENCE > ATMOSPHERE > CLOUDS > CLOUD PROPERTIES > CLOUD HEIGHT Recommended')
        expect(keywords[5]).toHaveTextContent('EARTH SCIENCE > ATMOSPHERE > CLOUDS > CLOUD PROPERTIES > CLOUD TOP TEMPERATURE Recommended')
        expect(keywords[6]).toHaveTextContent('EARTH SCIENCE > ATMOSPHERE > ATMOSPHERIC RADIATION > REFLECTANCE Recommended')
        expect(keywords[7]).toHaveTextContent('EARTH SCIENCE > ATMOSPHERE > CLOUDS Recommended')
        expect(keywords.length).toBe(8)
      })
    })

    test('can add a recommended keyword to formdata', async () => {
      const draft = {
        ummMetadata: {
          Abstract: 'cloud cover and the ozone'
        }
      }
      const { user, unmount, container } = setup({ draft })

      await waitFor(() => {
        expect(screen.getAllByRole('listitem').length).toBe(8)
      })

      const keywords = screen.getAllByRole('listitem')
      expect(keywords[1]).toHaveTextContent('EARTH SCIENCE > ATMOSPHERE > CLOUDS > CLOUD PROPERTIES > CLOUD TOP PRESSURE Recommended')
      const addIcon = within(keywords[1]).getByTitle('Add')
      await user.click(addIcon)

      await waitForResponse()

      await waitFor(() => {
        expect(within(container).getAllByRole('img', { name: 'Remove' }).length).toBe(2)
      })

      unmount()

      await waitFor(() => {
        expect(sendKeywordRecommendationsFeedback).toBeCalledTimes(1)
        expect(sendKeywordRecommendationsFeedback).toBeCalledWith('b0b399d7-abaf-4bd7-b2bf-5484605ffd97', {
          '1317aad9-d939-4152-9c30-07be5f193c8b': false,
          '503c65c1-1cc1-4b8a-acb8-4471994e2666': true,
          '8c15cd1c-2655-4a12-8f60-d850d0097632': false,
          'd106d9b6-f401-455b-82d5-d04aeab5d269': false,
          '9e734f01-893a-4552-b28c-a89e71414715': false,
          'd5e55c88-f9ba-4fac-8ece-4d1711ab14d7': false,
          '7927d4d1-a511-4e60-a6ff-ea5d64c8ab93': false,
          '3da1fc4e-6737-44a3-aadb-8d1b46068495': false
        }, [])
      })
    })

    test('can add a new keyword to formdata', async () => {
      const draft = {
        ummMetadata: {
          Abstract: 'cloud cover and the ozone'
        }
      }
      const { user, unmount } = setup({ draft })

      await waitFor(() => {
        expect(screen.getAllByRole('listitem').length).toBe(8)
      })

      const button = screen.getByRole('button', { name: 'Add New Keyword' })

      await user.click(button)

      await waitFor(() => {
        const keywords = screen.getAllByRole('listitem')
        expect(keywords.length).toBe(9)
      })

      unmount()

      await waitFor(() => {
        expect(sendKeywordRecommendationsFeedback).toBeCalledTimes(1)
        expect(sendKeywordRecommendationsFeedback).toBeCalledWith('b0b399d7-abaf-4bd7-b2bf-5484605ffd97', {
          '1317aad9-d939-4152-9c30-07be5f193c8b': false,
          '503c65c1-1cc1-4b8a-acb8-4471994e2666': false,
          '8c15cd1c-2655-4a12-8f60-d850d0097632': false,
          'd106d9b6-f401-455b-82d5-d04aeab5d269': false,
          '9e734f01-893a-4552-b28c-a89e71414715': false,
          'd5e55c88-f9ba-4fac-8ece-4d1711ab14d7': false,
          '7927d4d1-a511-4e60-a6ff-ea5d64c8ab93': false,
          '3da1fc4e-6737-44a3-aadb-8d1b46068495': false
        }, ['EARTH SCIENCE > ATMOSPHERE > CLOUDS > CLOUD PROPERTIES > CLOUD TOP PRESSURE > NEW KEYWORD'])
      })
    })

    test('handles error fetching recommended keywords', async () => {
      getKeywordRecommendations.mockImplementation(() => Promise.reject(new Error('GKR is down')))

      const draft = {
        ummMetadata: {
          Abstract: 'cloud cover and the ozone'
        }
      }
      setup({ draft })

      await waitFor(() => {
        expect(errorLogger).toBeCalledWith('error fetching keywords from GKR', 'GKR is down')
      })
    })

    describe('when draft HAS science keywords', () => {
      test('only includes the 2 form data keywords -- should not retreive recommended keywords', async () => {
        const draft = {
          ummMetadata: {
            Abstract: 'cloud cover and the ozone',
            ScienceKeywords: [
              {
                Category: 'EARTH SCIENCE',
                Topic: 'ATMOSPHERE',
                Term: 'CLOUDS',
                VariableLevel1: 'CLOUD PROPERTIES',
                VariableLevel2: 'CLOUD TOP PRESSURE',
                VariableLevel3: null
              },
              {
                Category: 'EARTH SCIENCE',
                Topic: 'ATMOSPHERE',
                Term: 'CLOUDS',
                VariableLevel1: 'CLOUD PROPERTIES',
                VariableLevel2: 'CLOUD TOP PRESSURE',
                VariableLevel3: 'DELETE ME'
              }
            ]
          }
        }
        setup({ draft })

        await waitForResponse()

        const keywords = screen.getAllByRole('listitem')
        expect(keywords.length).toBe(2)
      })

      test('can remove a keyword from the list', async () => {
        const draft = {
          ummMetadata: {
            Abstract: 'cloud cover and the ozone',
            ScienceKeywords: [
              {
                Category: 'EARTH SCIENCE',
                Topic: 'ATMOSPHERE',
                Term: 'CLOUDS',
                VariableLevel1: 'CLOUD PROPERTIES',
                VariableLevel2: 'CLOUD TOP PRESSURE',
                VariableLevel3: null
              },
              {
                Category: 'EARTH SCIENCE',
                Topic: 'ATMOSPHERE',
                Term: 'CLOUDS',
                VariableLevel1: 'CLOUD PROPERTIES',
                VariableLevel2: 'CLOUD TOP PRESSURE',
                VariableLevel3: 'DELETE ME'
              }
            ]
          }
        }
        const { user, unmount } = setup({ draft })

        await waitForResponse()

        const keywords = screen.getAllByRole('listitem')
        expect(keywords.length).toBe(2)
        expect(keywords[1]).toHaveTextContent('EARTH SCIENCE > ATMOSPHERE > CLOUDS > CLOUD PROPERTIES > CLOUD TOP PRESSURE > DELETE ME')
        const removeIcon = within(keywords[1]).getByRole('img', { name: 'Remove' })
        await user.click(removeIcon)

        await waitFor(() => {
          expect(screen.getAllByRole('listitem').length).toBe(1)
        })

        unmount()

        expect(sendKeywordRecommendationsFeedback).toBeCalledTimes(0)
      })
    })
  })

  describe('when draft does not contain a abstract', () => {
    test('renders no recommendations', async () => {
      const draft = {}
      setup({ draft })

      await waitForResponse()

      const keywords = screen.queryAllByRole('listitem')
      expect(keywords.length).toBe(0)
    })
  })
})
