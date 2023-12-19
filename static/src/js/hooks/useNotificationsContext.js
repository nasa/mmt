import { useContext } from 'react'

import NotificationsContext from '../context/NotificationsContext'

const useNotificationsContext = () => useContext(NotificationsContext)

export default useNotificationsContext
