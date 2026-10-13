import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import useCollectionSelectionContext from '../../../hooks/useCollectionSelectionContext'
import CollectionSelectionContextProvider from '../CollectionSelectionContextProvider'

const MockComponent = () => {
  const {
    clearCollectionSelections,
    deselectCollections,
    selectCollections,
    selectedCollections,
    selectedProvider,
    toggleCollectionSelection
  } = useCollectionSelectionContext()

  return (
    <div>
      <button
        type="button"
        onClick={() => toggleCollectionSelection('C1-TESTPROV', 'TESTPROV')}
      >
        Toggle C1 (TESTPROV)
      </button>
      <button
        type="button"
        onClick={() => toggleCollectionSelection('C2-TESTPROV', 'TESTPROV')}
      >
        Toggle C2 (TESTPROV)
      </button>
      <button
        type="button"
        onClick={() => toggleCollectionSelection('C3-MMT', 'MMT')}
      >
        Toggle C3 (MMT)
      </button>
      <button
        type="button"
        onClick={
          () => selectCollections([
            {
              conceptId: 'C1-TESTPROV',
              provider: 'TESTPROV'
            },
            {
              conceptId: 'C2-TESTPROV',
              provider: 'TESTPROV'
            },
            {
              conceptId: 'C3-MMT',
              provider: 'MMT'
            }
          ])
        }
      >
        Select all (C1, C2 TESTPROV; C3 MMT)
      </button>
      <button
        type="button"
        onClick={() => deselectCollections(['C1-TESTPROV', 'C2-TESTPROV'])}
      >
        Deselect C1, C2
      </button>
      <button
        type="button"
        onClick={clearCollectionSelections}
      >
        Clear
      </button>
      <div>
        Selected provider:
        {' '}
        {selectedProvider}
      </div>
      <div>
        Selected collections:
        {' '}
        {selectedCollections.join(',')}
      </div>
    </div>
  )
}

const setup = () => {
  const user = userEvent.setup()

  render(
    <CollectionSelectionContextProvider>
      <MockComponent />
    </CollectionSelectionContextProvider>
  )

  return { user }
}

describe('CollectionSelectionContextProvider component', () => {
  test('starts with no selections and no locked provider', () => {
    setup()

    expect(screen.getByText('Selected provider:', { exact: false }).textContent).toBe('Selected provider: ')
    expect(screen.getByText('Selected collections:', { exact: false }).textContent).toBe('Selected collections: ')
  })

  test('selecting a collection adds it and locks the provider', async () => {
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: 'Toggle C1 (TESTPROV)' }))

    expect(screen.getByText('Selected provider:', { exact: false }).textContent).toBe('Selected provider: TESTPROV')
    expect(screen.getByText('Selected collections:', { exact: false }).textContent).toBe('Selected collections: C1-TESTPROV')
  })

  test('selecting another collection from the same provider adds it to the selection', async () => {
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: 'Toggle C1 (TESTPROV)' }))
    await user.click(screen.getByRole('button', { name: 'Toggle C2 (TESTPROV)' }))

    expect(screen.getByText('Selected collections:', { exact: false }).textContent).toBe('Selected collections: C1-TESTPROV,C2-TESTPROV')
  })

  test('selecting a collection from a different provider is ignored', async () => {
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: 'Toggle C1 (TESTPROV)' }))
    await user.click(screen.getByRole('button', { name: 'Toggle C3 (MMT)' }))

    expect(screen.getByText('Selected provider:', { exact: false }).textContent).toBe('Selected provider: TESTPROV')
    expect(screen.getByText('Selected collections:', { exact: false }).textContent).toBe('Selected collections: C1-TESTPROV')
  })

  test('deselecting a collection removes it from the selection', async () => {
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: 'Toggle C1 (TESTPROV)' }))
    await user.click(screen.getByRole('button', { name: 'Toggle C2 (TESTPROV)' }))
    await user.click(screen.getByRole('button', { name: 'Toggle C1 (TESTPROV)' }))

    expect(screen.getByText('Selected collections:', { exact: false }).textContent).toBe('Selected collections: C2-TESTPROV')
  })

  test('deselecting the last collection unlocks the provider', async () => {
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: 'Toggle C1 (TESTPROV)' }))
    await user.click(screen.getByRole('button', { name: 'Toggle C1 (TESTPROV)' }))

    expect(screen.getByText('Selected provider:', { exact: false }).textContent).toBe('Selected provider: ')

    await user.click(screen.getByRole('button', { name: 'Toggle C3 (MMT)' }))

    expect(screen.getByText('Selected provider:', { exact: false }).textContent).toBe('Selected provider: MMT')
  })

  test('clearCollectionSelections removes all selections and unlocks the provider', async () => {
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: 'Toggle C1 (TESTPROV)' }))
    await user.click(screen.getByRole('button', { name: 'Toggle C2 (TESTPROV)' }))
    await user.click(screen.getByRole('button', { name: 'Clear' }))

    expect(screen.getByText('Selected provider:', { exact: false }).textContent).toBe('Selected provider: ')
    expect(screen.getByText('Selected collections:', { exact: false }).textContent).toBe('Selected collections: ')
  })

  describe('selectCollections', () => {
    test('locks to the first candidate\'s provider and skips candidates from other providers', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select all (C1, C2 TESTPROV; C3 MMT)' }))

      expect(screen.getByText('Selected provider:', { exact: false }).textContent).toBe('Selected provider: TESTPROV')
      expect(screen.getByText('Selected collections:', { exact: false }).textContent).toBe('Selected collections: C1-TESTPROV,C2-TESTPROV')
    })

    test('only adds candidates matching an already-locked provider', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Toggle C3 (MMT)' }))
      await user.click(screen.getByRole('button', { name: 'Select all (C1, C2 TESTPROV; C3 MMT)' }))

      expect(screen.getByText('Selected provider:', { exact: false }).textContent).toBe('Selected provider: MMT')
      expect(screen.getByText('Selected collections:', { exact: false }).textContent).toBe('Selected collections: C3-MMT')
    })

    test('does not duplicate candidates that are already selected', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Toggle C1 (TESTPROV)' }))
      await user.click(screen.getByRole('button', { name: 'Select all (C1, C2 TESTPROV; C3 MMT)' }))

      expect(screen.getByText('Selected collections:', { exact: false }).textContent).toBe('Selected collections: C1-TESTPROV,C2-TESTPROV')
    })
  })

  describe('deselectCollections', () => {
    test('removes only the specified collections from the selection', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Toggle C1 (TESTPROV)' }))
      await user.click(screen.getByRole('button', { name: 'Toggle C2 (TESTPROV)' }))
      await user.click(screen.getByRole('button', { name: 'Deselect C1, C2' }))

      expect(screen.getByText('Selected collections:', { exact: false }).textContent).toBe('Selected collections: ')
      expect(screen.getByText('Selected provider:', { exact: false }).textContent).toBe('Selected provider: ')
    })
  })
})
