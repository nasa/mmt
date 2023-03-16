import React from 'react'
import {
  getByTestId,
  render, screen
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import UmmToolsModel from '../../model/UmmToolsModel'
import MetadataEditor from '../../MetadataEditor'
import NavigationItem from '../NavigationItem'
import NavigationView from '../NavigationView'

const model = new UmmToolsModel()
const editor = new MetadataEditor(model)
const history = createMemoryHistory()

describe('Navigation Item Component', () => {
  it('renders a navigation item', async () => {
    const section = model.formSections[0]
    const { container } = render(
      <Router location={history.location} navigator={history}>
        <NavigationItem editor={editor} section={section} />
      </Router>
    )
    expect(screen.getByTestId('navigationitem--listgroup.item__tool-information')).toHaveTextContent('Tool Information')
    expect(container).toMatchSnapshot()
  })

  it('shows required error', async () => {
    const { container } = render(
      <Router location={history.location} navigator={history}>
        <NavigationView editor={editor} />
      </Router>
    )
    const toolInformation = screen.queryByTestId('navigationitem--tool-information')
    expect(getByTestId(toolInformation, 'error-list-item__name')).toHaveTextContent('Must have required property \'Name\'')
    expect(container).toMatchSnapshot()
  })

  it('shows red for section with errors', async () => {
    const model = new UmmToolsModel()
    model.draft.json = { LongName: 'x' }
    const editor = new MetadataEditor(model)
    const { container } = render(
      <Router location={history.location} navigator={history}>
        <NavigationView editor={editor} />
      </Router>
    )
    const toolInformation = screen.queryByTestId('navigationitem--tool-information')
    const element = toolInformation.querySelector('i')
    expect(element).toHaveClass('red-progress-circle')
    expect(container).toMatchSnapshot()
  })

  it('shows green for section with no issues', async () => {
    const model = new UmmToolsModel()
    model.draft.json = {
      URL: {
        URLContentType: 'content type',
        Type: 'type',
        URLValue: 'value'
      },
      Name: 'name',
      LongName: 'long name',
      Version: 'version',
      Type: 'Downloadable Tool',
      Description: 'description'
    }
    const editor = new MetadataEditor(model)
    const { container } = render(
      <Router location={history.location} navigator={history}>
        <NavigationView editor={editor} />
      </Router>
    )
    const toolInformation = screen.queryByTestId('navigationitem--tool-information')
    const element = toolInformation.querySelector('i')
    expect(element).toHaveClass('green-progress-circle')
    expect(container).toMatchSnapshot()
  })

  it('hovers over', async () => {
    const section = model.formSections[0]
    const spy = jest.spyOn(NavigationItem.WrappedComponent.prototype, 'setFocus')
    const { container } = render(
      <Router location={history.location} navigator={history}>
        <NavigationItem editor={editor} section={section} />
      </Router>
    )
    const toolInformation = screen.getByTestId('navigationitem--listgroup.item__tool-information')
    userEvent.hover(toolInformation)
    expect(spy).toHaveBeenCalledTimes(1)
    userEvent.unhover(toolInformation)
    expect(spy).toHaveBeenCalledTimes(2)
    expect(container).toMatchSnapshot()
  })

  it('clicking on a item triggers navigate to', async () => {
    const section = model.formSections[0]
    const { container } = render(
      <Router location={history.location} navigator={history}>
        <NavigationItem editor={editor} section={section} />
      </Router>
    )
    const toolInformation = screen.getByTestId('navigationitem--listgroup.item__tool-information')
    const spy = jest.spyOn(MetadataEditor.prototype, 'navigateTo')
    userEvent.click(toolInformation)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(container).toMatchSnapshot()
  })
})
