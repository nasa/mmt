import { gql } from '@apollo/client'

// Query to get non nasa draft user acls
// NOTE: The term "Non-NASA Draft User" is historical and may not accurately
// reflect current permissions. Users with this ACL can now create and publish
// concepts as long as they have EDL + MFA with this permission, not just draft
// them. Additionally, users must be provisioned for a specific provider.
// Full requirements for this access are:
// 1. EDL account
// 2. Multi-Factor Authentication (MFA)
// 3. This specific ACL
// 4. Provisioning for a specific provider
// Consider updating terminology and documentation in the future to reflect these requirements.
export const GET_NON_NASA_DRAFT_USER_ACLS = gql`
  query GetNonNasaDraftUserAcls($params: AclsInput) {
    acls(params: $params) {
      items {
        name
      }
    }
  }
`
