import '@testing-library/jest-dom'
import { act } from '@testing-library/react'

// https://stackoverflow.com/questions/54382414/fixing-react-leaflet-testing-error-cannot-read-property-layeradd-of-null/54384719#54384719
var createElementNSOrig = global.document.createElementNS

global.document.createElementNS = function (namespaceURI, qualifiedName) {
  if (namespaceURI === 'http://www.w3.org/2000/svg' && qualifiedName === 'svg') {
    var element = createElementNSOrig.apply(this, arguments)
    element.createSVGRect = function () { };
    return element;
  }
  return createElementNSOrig.apply(this, arguments)
}

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
window.HTMLElement.prototype.scrollIntoView = function() {}
window.scroll = function() {}
