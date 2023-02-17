import React from 'react'
import {
  render
} from '@testing-library/react'
import {
  BrowserRouter
} from 'react-router-dom'
import ProgressSection from '../ProgressSection'

describe('Progress Section Test', () => {
  it('renders in case section passed', async () => {
    const props = {
      section: 'Tool Information',
      status: 'Pass',
      fields: [
        {
          section: 'Tool Information',
          name: 'Name',
          index: null,
          status: 'Pass',
          required: true
        },
        {
          section: 'Tool Information',
          name: 'LongName',
          index: null,
          status: 'Pass',
          required: true
        },
        {
          section: 'Tool Information',
          name: 'Version',
          index: null,
          status: 'Pass',
          required: true
        },
        {
          section: 'Tool Information',
          name: 'VersionDescription',
          index: null,
          status: 'Not Started',
          required: false
        },
        {
          section: 'Tool Information',
          name: 'Type',
          index: null,
          status: 'Pass',
          required: true
        },
        {
          section: 'Tool Information',
          name: 'LastUpdatedDate',
          index: null,
          status: 'Not Started',
          required: false
        },
        {
          section: 'Tool Information',
          name: 'Description',
          index: null,
          status: 'Pass',
          required: true
        },
        {
          section: 'Tool Information',
          name: 'DOI',
          index: null,
          status: 'Pass',
          required: false
        },
        {
          section: 'Tool Information',
          name: 'URL',
          index: null,
          status: 'Pass',
          required: true
        }
      ]
    }
    const { getByTestId, container } = render(
      <BrowserRouter>
        <ProgressSection {...props} />
      </BrowserRouter>
    )
    const component = getByTestId('progress-section__tool-information_pass')
    expect(component).toBeTruthy()
    expect(component).toHaveTextContent('Tool Information')
    expect(getByTestId('progress-field__name_null_required_pass')).toBeTruthy()
    expect(getByTestId('progress-field__long-name_null_required_pass')).toBeTruthy()
    expect(getByTestId('progress-field__version_null_required_pass')).toBeTruthy()
    expect(getByTestId('progress-field__version-description_null_not-required_not-started')).toBeTruthy()
    expect(getByTestId('progress-field__type_null_required_pass')).toBeTruthy()
    expect(getByTestId('progress-field__last-updated-date_null_not-required_not-started')).toBeTruthy()
    expect(getByTestId('progress-field__description_null_required_pass')).toBeTruthy()
    expect(getByTestId('progress-field__doi_null_not-required_pass')).toBeTruthy()
    expect(getByTestId('progress-field__url_null_required_pass')).toBeTruthy()
    expect(container).toMatchSnapshot()
  })
  it('renders in case section not passed', async () => {
    const props = {
      section: 'Tool Information',
      status: 'Error',
      fields: [
        {
          section: 'Tool Information',
          name: 'Name',
          index: null,
          status: 'Pass',
          required: true
        },
        {
          section: 'Tool Information',
          name: 'LongName',
          index: null,
          status: 'Error',
          required: true
        },
        {
          section: 'Tool Information',
          name: 'Version',
          index: null,
          status: 'Pass',
          required: true
        },
        {
          section: 'Tool Information',
          name: 'VersionDescription',
          index: null,
          status: 'Not Started',
          required: false
        },
        {
          section: 'Tool Information',
          name: 'Type',
          index: null,
          status: 'Pass',
          required: true
        },
        {
          section: 'Tool Information',
          name: 'LastUpdatedDate',
          index: null,
          status: 'Not Started',
          required: false
        },
        {
          section: 'Tool Information',
          name: 'Description',
          index: null,
          status: 'Pass',
          required: true
        },
        {
          section: 'Tool Information',
          name: 'DOI',
          index: null,
          status: 'Pass',
          required: false
        },
        {
          section: 'Tool Information',
          name: 'URL',
          index: null,
          status: 'Pass',
          required: true
        }
      ]
    }
    const { getByTestId, container } = render(
      <BrowserRouter>
        <ProgressSection {...props} />
      </BrowserRouter>
    )
    const component = getByTestId('progress-section__tool-information_error')
    expect(component).toBeTruthy()
    expect(component).toHaveTextContent('Tool Information')
    expect(getByTestId('progress-field__name_null_required_pass')).toBeTruthy()
    expect(getByTestId('progress-field__long-name_null_required_error')).toBeTruthy()
    expect(getByTestId('progress-field__version_null_required_pass')).toBeTruthy()
    expect(getByTestId('progress-field__version-description_null_not-required_not-started')).toBeTruthy()
    expect(getByTestId('progress-field__type_null_required_pass')).toBeTruthy()
    expect(getByTestId('progress-field__last-updated-date_null_not-required_not-started')).toBeTruthy()
    expect(getByTestId('progress-field__description_null_required_pass')).toBeTruthy()
    expect(getByTestId('progress-field__doi_null_not-required_pass')).toBeTruthy()
    expect(getByTestId('progress-field__url_null_required_pass')).toBeTruthy()
    expect(container).toMatchSnapshot()
  })
  it('renders in case section empty', async () => {
    const props = {
      section: 'Tool Contacts',
      status: 'Not Started',
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
    const { getByTestId, container } = render(
      <BrowserRouter>
        <ProgressSection {...props} />
      </BrowserRouter>
    )
    const component = getByTestId('progress-section__tool-contacts_not-started')
    expect(component).toBeTruthy()
    expect(component).toHaveTextContent('Tool Contacts')
    expect(getByTestId('progress-field__contact-groups_null_required_not-started')).toBeTruthy()
    expect(getByTestId('progress-field__contact-persons_null_not-required_not-started')).toBeTruthy()
    expect(container).toMatchSnapshot()
  })
  it('renders in case section status unknown', async () => {
    const props = {
      section: 'Tool Contacts',
      status: 'Made Up',
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
    const { getByTestId, container } = render(
      <BrowserRouter>
        <ProgressSection {...props} />
      </BrowserRouter>
    )
    const component = getByTestId('progress-section__tool-contacts_made-up')
    expect(component).toBeTruthy()
    expect(component).toHaveTextContent('Tool Contacts')
    expect(component).toHaveTextContent('Status Unknown')
    expect(getByTestId('progress-field__contact-groups_null_required_not-started')).toBeTruthy()
    expect(getByTestId('progress-field__contact-persons_null_not-required_not-started')).toBeTruthy()
    expect(container).toMatchSnapshot()
  })
})
