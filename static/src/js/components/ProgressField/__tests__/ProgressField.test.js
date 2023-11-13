import { render, screen } from '@testing-library/react'
import React from 'react'
import ProgressField from '../ProgressField'
import progressCircleTypes from '../../../constants/progressCircleTypes'

const setup = (fieldInfo) => {
  render(
    <ProgressField
      fieldInfo={fieldInfo}
      formName="Test Form"
    />
  )
}

describe('ProgressField', () => {
  describe('when the field status is invalid', () => {
    test('renders the correct icon', () => {
      setup({
        fieldName: 'Test Field',
        message: 'mock message',
        isRequired: false,
        status: progressCircleTypes.Invalid
      })

      expect(screen.getByTitle('mock message').className).toContain('progress-field__icon--invalid-circle')
    })
  })

  describe('when the field status is not started', () => {
    describe('when the field is required', () => {
      test('renders the correct icon', () => {
        setup({
          fieldName: 'Test Field',
          message: 'mock message',
          isRequired: true,
          status: progressCircleTypes.NotStarted
        })

        expect(screen.getByTitle('mock message').className).toContain('progress-field__icon--not-started-required-circle')
      })
    })

    describe('when the field is not required', () => {
      test('renders the correct icon', () => {
        setup({
          fieldName: 'Test Field',
          message: 'mock message',
          isRequired: false,
          status: progressCircleTypes.NotStarted
        })

        expect(screen.getByTitle('Test Field').className).toContain('progress-field__icon--not-started-not-required-circle')
      })
    })
  })

  describe('when the field status is pass', () => {
    describe('when the field is required', () => {
      test('renders the correct icon', () => {
        setup({
          fieldName: 'Test Field',
          message: 'mock message',
          isRequired: true,
          status: progressCircleTypes.Pass
        })

        expect(screen.getByTitle('Test Field - Required field complete').className).toContain('progress-field__icon--pass-required-circle')
      })
    })

    describe('when the field is not required', () => {
      test('renders the correct icon', () => {
        setup({
          fieldName: 'Test Field',
          message: 'mock message',
          isRequired: false,
          status: progressCircleTypes.Pass
        })

        expect(screen.getByTitle('mock message').className).toContain('progress-field__icon--pass-not-required-circle')
      })
    })
  })

  describe('when the field status is error', () => {
    test('renders the correct icon', () => {
      setup({
        fieldName: 'Test Field',
        message: 'mock message',
        isRequired: false,
        status: progressCircleTypes.Error
      })

      expect(screen.getByTitle('mock message').className).toContain('progress-field__icon--error-circle')
    })
  })

  describe('when the field status is unknown', () => {
    test('renders the correct icon', () => {
      setup({
        fieldName: 'Test Field',
        message: 'mock message',
        isRequired: false,
        status: 'unknown'
      })

      expect(screen.getByText('Status Unknown')).toBeInTheDocument()
    })
  })
})
