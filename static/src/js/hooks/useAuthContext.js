import { useContext } from 'react'

import AuthContext from '../context/AuthContext'

const useAuthContext = () => useContext(AuthContext)

export default useAuthContext
