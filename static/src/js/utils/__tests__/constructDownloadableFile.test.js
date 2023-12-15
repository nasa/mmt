import React from 'react'
import { render, screen } from '@testing-library/react'
import { Button } from 'react-bootstrap'
import userEvent from '@testing-library/user-event'
import constructDownloadableFile from '../constructDownloadableFile'

describe('constructDownloadableFile', () => {
  describe('when a request is made to download a file', () => {
    test('triggers the download', async () => {
      global.URL.createObjectURL = jest.fn()
      const container = render(
        <div>
          <Button onClick={
            () => {
              constructDownloadableFile('my mock content', 'mock_file')
            }
          }
          >
            Download

          </Button>
        </div>
      )
      delete window.location
      const button = container.getByRole('button', { name: 'Download' })
      button.click()
      const link = screen.getByRole('link')
      expect(link.getAttribute('download')).toBe('mock_file')
    })
  })
})
