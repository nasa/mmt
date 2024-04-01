import { render, screen } from '@testing-library/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import * as router from 'react-router'

import ProgressField from '../ProgressField'

import progressCircleTypes from '../../../constants/progressCircleTypes'

const setup = (fieldInfo) => {
  render(
    <BrowserRouter>
      <ProgressField
        fieldInfo={fieldInfo}
        formName="Test Form"
      />
    </BrowserRouter>
  )

  return {
    user: userEvent.setup()
  }
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

      expect(screen.getByRole('img', { name: 'mock message' }).className).toContain('progress-field__icon--invalid-circle')
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

        expect(screen.getByRole('img', { name: 'mock message' }).className).toContain('progress-field__icon--not-started-required-circle')
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

        expect(screen.getByRole('img', { name: 'Test Field' }).className).toContain('progress-field__icon--not-started-not-required-circle')
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

        expect(screen.getByRole('img', { name: 'Test Field - Required field complete' }).className).toContain('progress-field__icon--pass-required-circle')
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

        expect(screen.getByRole('img', { name: 'mock message' }).className).toContain('progress-field__icon--pass-not-required-circle')
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

      expect(screen.getByRole('img', { name: 'mock message' }).className).toContain('progress-field__icon--error-circle')
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

  describe('when clicking on the field', () => {
    test('navigates to the form', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      const { user } = setup({
        fieldName: 'Test Field',
        message: 'mock message',
        isRequired: false,
        status: progressCircleTypes.Invalid
      })

      const icon = screen.getByRole('img', { name: 'mock message' })
      await user.click(icon)

      expect(navigateSpy).toHaveBeenCalledTimes(1)
      expect(navigateSpy).toHaveBeenCalledWith('test-form/Test Field')
    })
  })
})
