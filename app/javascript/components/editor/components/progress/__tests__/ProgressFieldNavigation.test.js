import React from 'react'
import {
  render, fireEvent
} from '@testing-library/react'
import {
  BrowserRouter
} from 'react-router-dom'
import ProgressField from '../ProgressField'
import { FieldInfo } from '../FieldInfo'
import { ProgressCircleType } from '../ProgressCircleType'
import MetadataEditor from '../../../MetadataEditor'
import UmmToolsModel from '../../../model/UmmToolsModel'

// This test needed to be moved into another file, we were getting some strange thread issues
// where the field info object was not showing the proper state (offset of 2 was not showing).
// Need to revisit to figure out why.
describe('Progress field navigation test array field', () => {
  test('navigate to edit a field in array', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const fieldInfo = new FieldInfo('Related URLs', 'Related URLs', 2, ProgressCircleType.Pass, true)
    const props = {
      fieldInfo,
      editor
    }
    const { queryByTestId, container } = render(
      <BrowserRouter>
        <ProgressField {...props} />
      </BrowserRouter>
    )
    const spy = jest.spyOn(ProgressField.WrappedComponent.prototype, 'navigateTo')
    const clickField = queryByTestId('progress-field__related-ur-ls_link')
    fireEvent.click(clickField)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(container).toMatchSnapshot()
  })
})
