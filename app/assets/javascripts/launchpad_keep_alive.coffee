$(document).ready ->
  # Only do the keep alive if launchpad is enabled and the user isn't on
  # the welcome page
  if launchpadEnabled && !$('main.welcome').length > 0
    fullSessionLength = 840000 # 14 minutes (in milliseconds)
    sessionLength = fullSessionLength
    lastActiveTime = Date.now()

    # Update the lastActiveTime
    setLastActiveTime = ->
      lastActiveTime = Date.now() unless Date.now() - lastActiveTime > 3600000

    # Was the user active within the last minute of a given session length?
    activeWithinLastSessionLength = (length) ->
      activeAgo = Date.now() - lastActiveTime
      activeAgo < length and activeAgo > length - 70000

    # Call the keep alive endpoint
    keepAlive = ->
      # if the user has been active within the sessionLength
      # or the sessionLength + 15/30/45 minutes (active within an hour)
      # call the keep alive endpoint
      if activeWithinLastSessionLength(sessionLength) or
      activeWithinLastSessionLength(sessionLength + fullSessionLength) or
      activeWithinLastSessionLength(sessionLength + (2 * fullSessionLength)) or
      activeWithinLastSessionLength(sessionLength + (3 * fullSessionLength))
        # if the keep alive was successful, update lastActiveTime
        $.get '/keep_alive', (data) ->
          # helpful for debugging
          # console.log data

    # Update the lastActiveTime unless the keep alive window has passed
    $(window).mousemove ->
      setLastActiveTime()
    $(window).click ->
      setLastActiveTime()
    $(window).keyup ->
      setLastActiveTime()

    # call keepAlive every sessionLength
    # setInterval(keepAlive, sessionLength)
    setInterval(keepAlive, 60000)

    # if the user changes pages in the middle of the session window
    # the keep alive timer will need to be shortened to ensure
    # the keep alive call is successful
    sessionLength = if remainingSessionTime > sessionLength then sessionLength else remainingSessionTime
