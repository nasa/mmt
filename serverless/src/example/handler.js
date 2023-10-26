const example = async (event) => {
  console.log('calling example')

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Example lambda function!',
      },
      null,
      2
    )
  }
}

export default example
