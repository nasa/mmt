const resetCmr = async () => {
  await fetch('http://localhost:2999/reset', {
    method: 'POST'
  }).then(() => console.log('CMR Data Reset'))
}

resetCmr()
