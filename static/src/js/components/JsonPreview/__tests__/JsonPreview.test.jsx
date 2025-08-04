import React from 'react'
import { render } from '@testing-library/react'
import JSONPretty from 'react-json-pretty'

import JsonPreview from '../JsonPreview'
import AppContext from '../../../context/AppContext'

vi.mock('react-json-pretty')

const setup = (draft = undefined) => {
  render(
    <AppContext.Provider value={{ draft }}>
      <JsonPreview />
    </AppContext.Provider>
  )
}

describe('JsonPreview Component', () => {
  describe('when draft is not present in the context', () => {
    test('renders JSONPretty', () => {
      setup()

      expect(JSONPretty).toHaveBeenCalledTimes(1)
      expect(JSONPretty).toHaveBeenCalledWith(expect.objectContaining({
        data: {}
      }), {})
    })
  })

  describe('when draft is null', () => {
    test('renders JSONPretty with empty object', () => {
      setup(null)

      expect(JSONPretty).toHaveBeenCalledTimes(1)
      expect(JSONPretty).toHaveBeenCalledWith(expect.objectContaining({
        data: {}
      }), {})
    })
  })

  describe('when ummMetadata is not present in draft', () => {
    test('renders JSONPretty', () => {
      setup({})

      expect(JSONPretty).toHaveBeenCalledTimes(1)
      expect(JSONPretty).toHaveBeenCalledWith(expect.objectContaining({
        data: {}
      }), {})
    })
  })

  describe('when draft metadata exists', () => {
    test('renders JSONPretty', () => {
      setup({
        ummMetadata: {
          Name: 'Mock Name'
        }
      })

      expect(JSONPretty).toHaveBeenCalledTimes(1)
      expect(JSONPretty).toHaveBeenCalledWith(expect.objectContaining({
        data: {
          Name: 'Mock Name'
        }
      }), {})
    })
  })
})
