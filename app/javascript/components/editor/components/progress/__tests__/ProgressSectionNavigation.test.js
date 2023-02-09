import React from 'react'
import {
  render, fireEvent
} from '@testing-library/react'
import {
  BrowserRouter
} from 'react-router-dom'
import ProgressSection from '../ProgressSection'

// Moved this ino a separate file for consistency, but it really should be included
// with ProgressSection.test.js once the comments in ProgressFieldNavigation.test.js
// are resolved.
describe('Progress field navigation test array field', () => {
  test('navigate to edit a field in array', async () => {
    const props = {
      section: 'Tool Contacts',
      status: 'Pass',
      fields: [
        {
          section: 'Tool Contacts',
          name: 'ContactGroups',
          index: null,
          status: 'Not Started',
          required: true
        },
        {
          section: 'Tool Contacts',
          name: 'ContactPersons',
          index: null,
          status: 'Not Started',
          required: false
        }
      ]
    }
    const { queryByTestId, container } = render(
      <BrowserRouter>
        <ProgressSection {...props} />
      </BrowserRouter>
    )
    const spy = jest.spyOn(ProgressSection.WrappedComponent.prototype, 'navigateTo')
    const clickField = queryByTestId('progress-section__tool-contacts_link')
    fireEvent.click(clickField)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(container).toMatchSnapshot()
  })
})
