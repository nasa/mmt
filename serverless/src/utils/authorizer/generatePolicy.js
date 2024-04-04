/**
 * Generate AuthPolicy for the Authorizer
 * @param {String} username username of authenticated uset
 * @param {String} effect
 * @param {Object} resource
 */
export const generatePolicy = (username, effect, resource) => {
  const authResponse = {
    principalId: username
  }

  if (effect && resource) {
    const policyDocument = {}
    policyDocument.Version = '2012-10-17'
    policyDocument.Statement = []
    const statementOne = {}
    statementOne.Action = 'execute-api:Invoke'
    statementOne.Effect = effect
    statementOne.Resource = resource
    policyDocument.Statement[0] = statementOne

    authResponse.policyDocument = policyDocument
  }

  return authResponse
}
