import React from 'react'
import {
  render,
  screen,
  within
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import KeywordRecommendationsKeyword from '../KeywordRecommendationsKeyword'

global.fetch = vi.fn()

const setup = ({
  overrideKeyword
} = {}) => {
  const keyword = overrideKeyword || {
    keyword: 'mock keyword',
    accepted: true,
    recommended: true
  }
  const addKeyword = vi.fn()
  const removeKeyword = vi.fn()
  const container = render(
    <KeywordRecommendationsKeyword
      keyword={keyword}
      addKeyword={addKeyword}
      removeKeyword={removeKeyword}
    />
  )

  return {
    container,
    user: userEvent.setup(),
    addKeyword,
    removeKeyword
  }
}

describe('KeywordRecommendationsKeyword component', () => {
  describe('when a recommended accepted keyword is given', () => {
    test('shows the keyword', () => {
      const overrideKeyword = {
        keyword: 'mock keyword',
        accepted: true,
        recommended: true
      }
      setup({ overrideKeyword })
      expect(screen.getByText('mock keyword')).toBeInTheDocument()
    })

    test('shows the recommended badge', () => {
      const overrideKeyword = {
        keyword: 'mock keyword',
        accepted: true,
        recommended: true
      }
      setup({ overrideKeyword })
      expect(screen.getByText('Recommended')).toHaveClass('badge')
    })

    test('shows it is accepted', () => {
      const overrideKeyword = {
        keyword: 'mock keyword',
        accepted: true,
        recommended: true
      }
      setup({ overrideKeyword })
      expect(screen.getByRole('img', { name: 'Accepted' })).toBeInTheDocument()
    })

    test('shows the X', () => {
      const overrideKeyword = {
        keyword: 'mock keyword',
        accepted: true,
        recommended: true
      }
      setup({ overrideKeyword })
      const listitem = screen.queryByRole('listitem')
      expect(within(listitem).getByRole('img', { name: 'Remove' })).toBeInTheDocument()
    })

    test('responds to clicking X', async () => {
      const overrideKeyword = {
        keyword: 'mock keyword',
        accepted: true,
        recommended: true
      }
      const { container, user, removeKeyword } = setup({ overrideKeyword })
      const listitem = container.queryByRole('listitem')
      await user.click(within(listitem).getByRole('img', { name: 'Remove' }))
      expect(removeKeyword).toBeCalledTimes(1)
    })
  })

  describe('when a recommended keyword is given that is not accepted yet', () => {
    test('shows the keyword', () => {
      const overrideKeyword = {
        keyword: 'mock keyword',
        accepted: false,
        recommended: true
      }
      setup({ overrideKeyword })
      expect(screen.getByText('mock keyword')).toBeInTheDocument()
    })

    test('shows the recommended badge', () => {
      const overrideKeyword = {
        keyword: 'mock keyword',
        accepted: false,
        recommended: true
      }
      setup({ overrideKeyword })
      expect(screen.getByText('Recommended')).toHaveClass('badge')
    })

    test('shows it is not accepted', () => {
      const overrideKeyword = {
        keyword: 'mock keyword',
        accepted: false,
        recommended: true
      }
      setup({ overrideKeyword })
      expect(screen.queryByRole('img', { name: 'Accepted' })).not.toBeInTheDocument()
    })

    test('does not show the X', () => {
      const overrideKeyword = {
        keyword: 'mock keyword',
        accepted: false,
        recommended: true
      }
      setup({ overrideKeyword })
      const listitem = screen.queryByRole('listitem')
      expect(within(listitem).queryByRole('img', { name: 'Remove' })).not.toBeInTheDocument()
    })

    test('does show +', () => {
      const overrideKeyword = {
        keyword: 'mock keyword',
        accepted: false,
        recommended: true
      }
      setup({ overrideKeyword })
      expect(screen.getByRole('img', { name: 'Add' })).toBeInTheDocument()
    })

    test('responds to clicking +', async () => {
      const overrideKeyword = {
        keyword: 'mock keyword',
        accepted: false,
        recommended: true
      }
      const { user, addKeyword } = setup({ overrideKeyword })
      await user.click(screen.queryByRole('img', { name: 'Add' }))
      expect(addKeyword).toBeCalledTimes(1)
    })
  })

  describe('when a non recommended accepted keyword is given', () => {
    test('shows the keyword', () => {
      const overrideKeyword = {
        keyword: 'mock keyword',
        accepted: true,
        recommended: false
      }
      setup({ overrideKeyword })
      expect(screen.getByText('mock keyword')).toBeInTheDocument()
    })

    test('does not show the recommended badge', () => {
      const overrideKeyword = {
        keyword: 'mock keyword',
        accepted: true,
        recommended: false
      }
      setup({ overrideKeyword })
      expect(screen.queryByRole('img', { name: 'Recommended' })).not.toBeInTheDocument()
    })

    test('shows it is accepted', () => {
      const overrideKeyword = {
        keyword: 'mock keyword',
        accepted: true,
        recommended: false
      }
      setup({ overrideKeyword })
      expect(screen.getByRole('img', { name: 'Accepted' })).toBeInTheDocument()
    })

    test('shows the X', () => {
      const overrideKeyword = {
        keyword: 'mock keyword',
        accepted: true,
        recommended: false
      }
      setup({ overrideKeyword })
      const listitem = screen.queryByRole('listitem')
      expect(within(listitem).getByRole('img', { name: 'Remove' })).toBeInTheDocument()
    })

    test('responds to clicking X', async () => {
      const overrideKeyword = {
        keyword: 'mock keyword',
        accepted: true,
        recommended: false
      }
      const { container, user, removeKeyword } = setup({ overrideKeyword })
      const listitem = container.queryByRole('listitem')
      await user.click(within(listitem).getByRole('img', { name: 'Remove' }))
      expect(removeKeyword).toBeCalledTimes(1)
    })
  })

  describe('when a non recommended keyword is given that is not accepted yet', () => {
    test('shows the keyword', () => {
      const overrideKeyword = {
        keyword: 'mock keyword',
        accepted: false,
        recommended: false
      }
      setup({ overrideKeyword })
      expect(screen.getByText('mock keyword')).toBeInTheDocument()
    })

    test('does not show the recommended badge', () => {
      const overrideKeyword = {
        keyword: 'mock keyword',
        accepted: false,
        recommended: false
      }
      setup({ overrideKeyword })
      expect(screen.queryByText('Recommended')).not.toBeInTheDocument()
    })

    test('shows it is not accepted', () => {
      const overrideKeyword = {
        keyword: 'mock keyword',
        accepted: false,
        recommended: false
      }
      setup({ overrideKeyword })
      expect(screen.queryByRole('img', { name: 'Accepted' })).not.toBeInTheDocument()
    })

    test('does show +', () => {
      const overrideKeyword = {
        keyword: 'mock keyword',
        accepted: false,
        recommended: false
      }
      setup({ overrideKeyword })
      expect(screen.queryByRole('img', { name: 'Add' })).toBeInTheDocument()
    })

    test('responds to clicking +', async () => {
      const overrideKeyword = {
        keyword: 'mock keyword',
        accepted: false,
        recommended: false
      }
      const { user, addKeyword } = setup({ overrideKeyword })
      await user.click(screen.queryByRole('button'))
      expect(addKeyword).toBeCalledTimes(1)
    })

    test('does not show the X', () => {
      const overrideKeyword = {
        keyword: 'mock keyword',
        accepted: false,
        recommended: false
      }
      setup({ overrideKeyword })
      const listitem = screen.queryByRole('listitem')
      expect(within(listitem).queryByRole('img', { name: 'Remove' })).not.toBeInTheDocument()
    })
  })
})
