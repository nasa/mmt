import { expect } from 'vitest'
import { act } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

global.fetch = vi.fn()

// Util method that waits for the graphql mock response to be set. This allows data to be rendered in the tests instead of the load banner
global.waitForResponse = async () => {
  await act(async () => new Promise((resolve, reject) => {
    try {
      setTimeout(resolve, 0)
    } catch (error) {
      reject(error)
    }
  }))
}

// JS Dom does not have scrollIntoView, so create it here
// https://stackoverflow.com/a/53294906
window.HTMLElement.prototype.scrollIntoView = vi.fn()
window.scroll = vi.fn()
