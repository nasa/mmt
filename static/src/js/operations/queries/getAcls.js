import { gql } from '@apollo/client'

//Query to retrieve acls
export const GET_ACLS = gql`
  query Acls($params: AclsInput) {
  acls(params: $params) {
    items {
      name
    }
  }
}
`

// Example Variables:
// {
//   "params": {
//     "includeFullAcl": true,
//     "pageNum": 1,
//     "pageSize": 20,
//     "permittedUser": "typical",
//     "target": "PROVIDER_CONTEXT"
//   }
// }