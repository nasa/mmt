import constructDownloadableFile from '../constructDownloadableFile'

describe('constructDownloadableFile', () => {
  test('downloads a json file', () => {
    global.URL.createObjectURL = vi.fn().mockReturnValue('mock-url')

    const mockBlob = {
      size: 155,
      type: 'application/json;charset:utf-8'
    }
    const blobSpy = vi.spyOn(global, 'Blob').mockImplementationOnce(() => mockBlob)

    const contents = JSON.stringify({
      mock: 'data'
    }, null, 2)
    const name = 'mock-file'

    constructDownloadableFile(contents, name)

    expect(blobSpy).toHaveBeenCalledTimes(1)
    expect(blobSpy).toHaveBeenCalledWith([contents], { type: 'application/json;charset:utf-8' })

    expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1)
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockBlob)

    const link = document.getElementsByTagName('a')[0]
    expect(link.getAttribute('download')).toEqual('mock-file')
    expect(link.getAttribute('href')).toEqual('mock-url')
  })
})
