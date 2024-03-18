import { gql } from '@apollo/client'

export const CREATE_ASSOCIATION = gql`
  mutation CreateAssociation (
    $conceptId: String!
    $collectionConceptIds: [JSON]!
    $nativeId: String
    $metadata: JSON
    $conceptType: ConceptType!
  ) {
    createAssociation (
      conceptId: $conceptId
      collectionConceptIds: $collectionConceptIds
      nativeId: $nativeId
      metadata: $metadata
      conceptType: $conceptType
    ) {
      associatedItem
      toolAssociation
      serviceAssociation
      variableAssociation
    }
  }
`
// Example Variables:
// {
//   "conceptId": "S1200000098-MMT_2",
//   "collectionConceptIds": [
//     {
//       "concept_id": "C12000000-MMT-2"
//     }
//   ],
//   "conceptType": "Service",
// }
