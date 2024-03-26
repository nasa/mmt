import { gql } from '@apollo/client'

export const DELETE_ASSOCIATION = gql`
  mutation DeleteAssociation (
    $conceptId: String!
    $collectionConceptIds: [JSON]!
    $conceptType: ConceptType!
  ) {
    deleteAssociation (
      conceptId: $conceptId
      collectionConceptIds: $collectionConceptIds
      conceptType: $conceptType
    ) {
      associatedItem
      serviceAssociation
      toolAssociation
      variableAssociation
      warnings
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
