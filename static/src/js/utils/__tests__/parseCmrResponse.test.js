import parseCmrResponse from '../parseCmrResponse'

describe('cmrKeywords', () => {
  test('returns a parsed list of enums from CMR', () => {
    const cmrKeywords = {
      short_name: [
        {
          value: 'HDF4',
          uuid: 'e5c126f8-0435-4cef-880f-72a1d2d792f2'
        },
        {
          value: 'ZIP',
          uuid: '5c406abc-104d-4517-96b8-dbbcf515f00f'
        },
        {
          value: 'PNG',
          uuid: '4c406abc-104d-4517-96b8-dbbcf515f00f'
        },
        {
          value: 'HDF5',
          uuid: '1c406abc-104d-4517-96b8-dbbcf515f00f'
        },
        {
          value: 'NETCDF-CF',
          uuid: '3c406abc-104d-4517-96b8-dbbcf515f00f'
        },
        {
          value: 'JPEG',
          uuid: '7443bb2d-1dbb-44d1-bd29-0241d30fbc57'
        },
        {
          value: 'ASCII',
          uuid: '8e128326-b9cb-44c7-9e6b-4bd950a08753'
        },
        {
          value: 'CSV',
          uuid: '465809cc-e76c-4630-8594-bb8bd7a1a380'
        },
        {
          value: 'netCDF-4',
          uuid: '30ea4e9a-4741-42c9-ad8f-f10930b35294'
        },
        {
          value: 'HTML',
          uuid: '2c406abc-104d-4517-96b8-dbbcf515f00f'
        }
      ]
    }

    const expectedResult = [
      ['ASCII'],
      ['CSV'],
      ['HDF4'],
      ['HDF5'],
      ['HTML'],
      ['JPEG'],
      ['netCDF-4'],
      ['NETCDF-CF'],
      ['PNG'],
      ['ZIP']
    ]
    const result = parseCmrResponse(cmrKeywords, 'short_name')

    expect(result).toEqual(expectedResult)
  })
})
