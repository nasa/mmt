import { GET_PROVIDERS } from '../../../../operations/queries/getProviders'

export const providerResults = {
  request: {
    query: GET_PROVIDERS,
    variables: {}
  },
  result: {
    data: {
      providers: {
        count: 3,
        items: [
          {
            providerId: 'TESTPROV',
            shortName: 'TESTPROV_SN'
          },
          {
            providerId: 'TESTPROV2',
            shortName: 'TESTPROV2_SN'
          },
          {
            providerId: 'TESTPROV3',
            shortName: 'TESTPROV3_SN'
          }
        ]
      }
    }
  }
}
