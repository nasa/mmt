import { gql } from '@apollo/client'

export const DELETE_ACL = gql`
  mutation DeleteAcl($conceptId: String!) {
    deleteAcl(conceptId: $conceptId) {
      conceptId
      revisionId
    }
  }`
