$(document).ready ->
  # Only do the keep alive if launchpad is enabled and the user isn't on
  # the welcome page
  if launchpadEnabled && !$('main.welcome').length > 0
    fullSessionLength = 840000 # 14 minutes (in milliseconds)
    lastActiveTime = Date.now()

    # sessionStart is the beginning of the session in which the user was last active
    sessionStart = Date.now()

    # if the user changes pages in the middle of the session window
    # the keep alive timer will need to be shortened to ensure
    # the keep alive call is successful
    sessionLength = if remainingSessionTime > sessionLength then sessionLength else remainingSessionTime

    # Update the lastActiveTime
    setLastActiveTime = ->
      lastActiveTime = Date.now() unless Date.now() - lastActiveTime > 3600000

    # Was the user active during the session?
    activeWithinLastSessionLength = (length) ->
      # were they active during the session length,
      # and is the current time within the last ~minute of the session length
      activeAgo = Date.now() - lastActiveTime
      activeAgo < length and Date.now() - sessionStart > length - 70000

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
          if data.success?
            # reset the sessionStart time
            sessionStart = Date.now()
            # the user was active and got a new session, so sessionLength needs to be reset to a full session
            sessionLength = fullSessionLength

    # Update the lastActiveTime
    $(window).mousemove ->
      setLastActiveTime()
    $(window).click ->
      setLastActiveTime()
    $(window).keyup ->
      setLastActiveTime()

    # call keepAlive every minute
    setInterval(keepAlive, 60000)
