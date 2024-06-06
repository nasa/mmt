import React from 'react'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import * as router from 'react-router'
import CollectionAssociationPreviewProgress from '../CollectionAssociationPreviewProgress'

const setup = (overrideProps = {}) => {
  const props = {
    collectionAssociationDetails: {
      collectionConceptId: 'C10000000-MMT_2',
      shortName: 'Collection Association Preview test',
      version: '1'
    },
    ...overrideProps
  }

  const user = userEvent.setup()

  render(
    <BrowserRouter>
      <CollectionAssociationPreviewProgress {...props} />
    </BrowserRouter>

  )

  return {
    user
  }
}

describe('CollectionAssociationPreviewProgress', () => {
  describe('when the section is valid and passed', () => {
    test('render the correct passed icons', () => {
      setup()

      expect(screen.getByRole('img', { name: 'Collection Association Passed' }).className).toContain('progress-section__section-icon--pass-circle')
      expect(screen.getByRole('img', { name: 'Collection Association - Required field complete' }).className).toContain('progress-field__icon--pass-required-circle')
    })
  })

  describe('when the section status is not started', () => {
    test('renders the correct section icon', () => {
      setup({
        collectionAssociationDetails: null
      })

      expect(screen.getByRole('img', { name: 'Collection Association Not Started' }).className).toContain('progress-section__section-icon--invalid-circle')
      expect(screen.getByRole('img', { name: 'Collection Association required' }).className).toContain('progress-field__icon--not-started-required-circle')
    })
  })

  describe('when clicking on the label', () => {
    test('navigates to the Collection Association form', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)
      const { user } = setup()

      const label = screen.getAllByRole('link')
      await user.click(label[0])

      expect(navigateSpy).toHaveBeenCalledTimes(1)
      expect(navigateSpy).toHaveBeenCalledWith('collection-association')
    })
  })
})
