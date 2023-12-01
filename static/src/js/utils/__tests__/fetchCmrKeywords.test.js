import fetchCmrKeywords from '../fetchCmrKeywords'

beforeEach(() => {
  jest.clearAllMocks()
})

global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({
    ok: true,
    status: 200,
    json: () => (
      {
        url_content_type: [{
          value: 'DataCenterURL',
          uuid: 'b2df0d8e-d236-4fd2-a4f6-12951b3bb17a',
          subfields: ['type'],
          type: [{
            value: 'HOME PAGE',
            uuid: '05c685ab-8ce0-4b8a-8eba-b15fc6bbddfa'
          }]
        }, {
          value: 'DataContactURL',
          uuid: '65373de8-3fb3-4882-a8ca-cfe23a4ff58e',
          subfields: ['type'],
          type: [{
            value: 'HOME PAGE',
            uuid: 'e5803df8-c802-4f3f-96f5-53e534835887'
          }]
        }]
      }
    )
  })
}))

describe('fetchCmrKeywords', () => {
  test('calls CMR for related-urls keywords and returns status 200', async () => {
    const response = await fetchCmrKeywords('related-urls')

    expect(response.status).toBe(200)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/search/keywords/related-urls')
  })

  test('calls CMR for related-urls keywords and returns null', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Error calling CMR')))

    const response = await fetchCmrKeywords('related-urls')

    expect(response).toEqual(null)
  })
})
