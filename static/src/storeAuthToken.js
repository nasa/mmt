import consumeAuthToken from './js/utils/consumeAuthToken'

/**
 * Imported for its side effect and imported ahead of the application on
 * purpose. ES modules are evaluated in the order they are imported and the
 * application's import graph evaluates 'react-cookie', which snapshots
 * document.cookie as it loads. A cookie written after that point is missing
 * from the first render and 'AuthContextProvider' treats a missing token as
 * a signal to clear the cookie, so the session is deleted before it is used.
*/
consumeAuthToken()
