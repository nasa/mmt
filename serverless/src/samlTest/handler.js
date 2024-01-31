const samlTest = async (event, context, callback) => {
  const location = 'http://localhost:4000/auth_callback2'

  const response = {
    statusCode: 302,
    headers: {
      'Set-Cookie': 'token=test',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET, POST',
      'Access-Control-Allow-Credentials': true,
      Chris: 'Test',
      Location: location
    }
  }

  return response
}

export default samlTest
