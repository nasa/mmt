import consumeAuthToken from './js/utils/consumeAuthToken'

/**
 * Imported for its side effect and imported ahead of the application on
 * purpose. 'App' pulls in 'react-cookie', which snapshots 'document.cookie'
 * as it loads, so a cookie written after that is missing from the first
 * render and 'AuthContextProvider' clears the session before it is ever used.
*/
consumeAuthToken()
