import { render, screen } from '@testing-library/react'
import React from 'react'
import ProgressSection from '../ProgressSection'
import progressCircleTypes from '../../../constants/progressCircleTypes'
import ProgressField from '../../ProgressField/ProgressField'

jest.mock('../../ProgressField/ProgressField')

const setup = (overrideProps = {}) => {
  const props = {
    displayName: 'Test Section',
    fields: [],
    status: progressCircleTypes.Pass,
    ...overrideProps
  }

  render(
    <ProgressSection {...props} />
  )
}

describe('ProgressSection', () => {
  describe('when the section status is pass', () => {
    test('renders the correct section icon', () => {
      setup()

      expect(screen.getByRole('img', { name: 'Test Section' }).className).toContain('progress-section__section-icon--pass-circle')
    })
  })

  describe('when the section status is not started', () => {
    test('renders the correct section icon', () => {
      setup({
        status: progressCircleTypes.NotStarted
      })

      expect(screen.getByRole('img', { name: 'Test Section' }).className).toContain('progress-section__section-icon--invalid-circle')
    })
  })

  describe('when the section status is error', () => {
    test('renders the correct section icon', () => {
      setup({
        status: progressCircleTypes.Error
      })

      expect(screen.getByRole('img', { name: 'Test Section' }).className).toContain('progress-section__section-icon--invalid-circle')
    })
  })

  describe('when the section status is invalid', () => {
    test('renders the correct section icon', () => {
      setup({
        status: progressCircleTypes.Invalid
      })

      expect(screen.getByRole('img', { name: 'Test Section' }).className).toContain('progress-section__section-icon--invalid-circle')
    })
  })

  describe('when the section status is unknown', () => {
    test('renders the correct section icon', () => {
      setup({
        status: 'unknown'
      })

      expect(screen.getByText('Status Unknown')).toBeInTheDocument()
    })
  })

  test('renders a list of ProgressField components', () => {
    setup({
      fields: [{
        fieldName: 'Test Field 1',
        message: 'mock message',
        isRequired: false,
        status: progressCircleTypes.Pass
      }, {
        fieldName: 'Test Field 2',
        message: 'mock message',
        isRequired: false,
        status: progressCircleTypes.Pass
      }]
    })

    expect(ProgressField).toHaveBeenCalledTimes(2)
    expect(ProgressField).toHaveBeenCalledWith({
      fieldInfo: {
        fieldName: 'Test Field 1',
        message: 'mock message',
        isRequired: false,
        status: progressCircleTypes.Pass
      },
      formName: 'Test Section'
    }, {})

    expect(ProgressField).toHaveBeenCalledWith({
      fieldInfo: {
        fieldName: 'Test Field 2',
        message: 'mock message',
        isRequired: false,
        status: progressCircleTypes.Pass
      },
      formName: 'Test Section'
    }, {})
  })
})
