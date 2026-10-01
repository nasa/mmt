import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import KmsConceptVersionSelector from '../KmsConceptVersionSelector'

const versions = [
  {
    value: 'draft',
    label: 'draft (DRAFT-NEXT RELEASE)',
    type: 'draft'
  },
  {
    value: '1.0',
    label: '1.0 (PRODUCTION)',
    type: 'published'
  }
]

describe('KmsConceptVersionSelector', () => {
  describe('when versions are loading', () => {
    test('should display the loading state', () => {
      render(
        <KmsConceptVersionSelector
          isLoading
          onVersionSelect={vi.fn()}
          versions={[]}
        />
      )

      expect(screen.getByText('Loading versions...')).toBeInTheDocument()
    })
  })

  describe('when a version is supplied', () => {
    test('should display the supplied version', () => {
      render(
        <KmsConceptVersionSelector
          onVersionSelect={vi.fn()}
          version={
            {
              version: '1.0',
              version_type: 'published'
            }
          }
          versions={versions}
        />
      )

      expect(screen.getByText('1.0 (PRODUCTION)')).toBeInTheDocument()
    })
  })

  describe('when the user selects a version', () => {
    test('should report the selected version', async () => {
      const user = userEvent.setup()
      const onVersionSelect = vi.fn()
      render(
        <KmsConceptVersionSelector
          onVersionSelect={onVersionSelect}
          versions={versions}
        />
      )

      await user.click(screen.getByRole('combobox'))
      await user.click(screen.getByText('1.0 (PRODUCTION)'))

      expect(onVersionSelect).toHaveBeenCalledWith({
        version: '1.0',
        version_type: 'published'
      })
    })
  })
})
