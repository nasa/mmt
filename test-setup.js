import { expect } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

global.fetch = vi.fn()

// JS Dom does not have scrollIntoView, so create it here
// https://stackoverflow.com/a/53294906
window.HTMLElement.prototype.scrollIntoView = vi.fn()
window.scroll = vi.fn()

vi.mock('lodash-es', async () => ({
  ...await vi.importActual('lodash-es'),
  // Don't need to wait around for debounce in tests
  debounce: vi.fn((fn) => fn)
}))

vi.mock('uuid', () => ({
  v4: () => 'mock-uuid'
}))

Object.defineProperty(globalThis, 'uuid', {
  value: {
    v4: () => 'mock-uuid'
  }
})
