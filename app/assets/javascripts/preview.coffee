
# Functions used for drawing on the collection preview page's map image

# Do a simple transformation to map lat/lon onto y/x of map image
convertLatLonToImageXY = (lat, lon, mapWidth, mapHeight) ->
  y = ((-1 * lat) + 90) * (mapHeight / 180.0)
  x = (180 + lon) * (mapWidth / 360.0)
  [x, y]

convertRectanglesForImage = (rectangles, mapWidth, mapHeight) ->
  convertedRectangles = []

  for rectangle in rectangles
    [x1, y1] = convertLatLonToImageXY(rectangle.north_bounding_coordinate, rectangle.west_bounding_coordinate, mapWidth, mapHeight)
    [x2, y2] = convertLatLonToImageXY(rectangle.south_bounding_coordinate, rectangle.east_bounding_coordinate, mapWidth, mapHeight)

    minX = Math.min(x1, x2)
    maxX = Math.max(x1, x2)
    minY = Math.min(y1, y2)
    maxY = Math.max(y1, y2)

    if rectangle.WestBoundingCoordinate > rectangle.EastBoundingCoordinate
      antiMeridian = convertLatLonToImageXY(0, 180, mapWidth, mapHeight)
      convertedRectangles.push {minX: minX, minY: minY, maxX: antiMeridian, maxY: maxY}
      convertedRectangles.push {minX: 0, minY: minY, maxX: minX, maxY: maxY}
    else
      convertedRectangles.push {minX: minX, minY: minY, maxX: maxX, maxY: maxY}

  convertedRectangles

drawPoint = (x, y, dotSize, highlightColor) ->
  pointStyle = "position:absolute;"
  pointStyle += "width: #{dotSize}px;"
  pointStyle += "height: #{dotSize}px;"
  pointStyle += "top: #{y}px;"
  pointStyle += "left: #{x}px;"
  pointStyle += "background: #{highlightColor}"
  $('<div />',
    class: 'preview-spatial',
    style: pointStyle
  ).appendTo($('#preview-map-parent'))

drawRectangle = (minX, minY, maxX, maxY, highlightColor) ->
  rectangleStyle = "position:absolute;"
  rectangleStyle += "width: #{(maxX - minX)}px;"
  rectangleStyle += "height: #{(maxY - minY)}px;"
  rectangleStyle += "top: #{minY}px;"
  rectangleStyle += "left: #{minX}px;"
  rectangleStyle += "background: #{highlightColor}"
  $('<div />',
    class: 'preview-spatial',
    style: rectangleStyle
  ).appendTo($('#preview-map-parent'))

previewSpatial = {}

@drawSpatialExtent = (previewSpatialHash) ->
  previewSpatial = previewSpatialHash
  $('.preview-spatial').remove()

  mapPosition = $('#preview-map').offset()
  mapWidth = $('#preview-map').width()
  mapHeight = $('#preview-map').height()
  mapX1 = mapPosition.left
  mapY1 = mapPosition.top
  highlightColor = 'rgba(250,0,0,0.25)'

  for point in previewSpatialHash.point_coordinate_array
    dotSize = 5
    [pointX, pointY] = convertLatLonToImageXY(point.Latitude, point.Longitude, mapWidth, mapHeight)
    drawPoint(pointX + mapX1, pointY + mapY1, dotSize, highlightColor)

  rectanglesToDraw = convertRectanglesForImage(previewSpatialHash.rectangle_coordinate_array, mapWidth, mapHeight)
  for rectangle in rectanglesToDraw
    minX = rectangle.minX
    minY = rectangle.minY
    maxX = rectangle.maxX
    maxY = rectangle.maxY
    drawRectangle minX, minY, maxX, maxY, highlightColor


# on window resize, redraw the spatial preview
$(window).resize ->
  drawSpatialExtent(window.previewSpatial) if window.previewSpatial?

# TODO: investigate this further or remove it
# $(window).fullscreenchange ->
#   drawSpatialExtent(window.previewSpatial) if window.previewSpatial?

# using window on load vs document ready waits until all images are loaded
# so the correct coordinates are gathered for mapPosition
# http://stackoverflow.com/questions/544993/official-way-to-ask-jquery-wait-for-all-images-to-load-before-executing-somethin
$(window).on 'load', ->
  drawSpatialExtent(window.previewSpatial) if window.previewSpatial?

$(document).ready ->

  # Show More / Show Less for the Preview Gem
  # Overview Tab: Science Keywords
  # Service Tab: Service Cards
  $('.show-more-toggle').on 'click', (e) ->
    e.preventDefault()
    $parentClass = $(e.target).data('parentClass')
    $listItem = $(e.target).data('listItem')
    $parent = $(this).closest($parentClass)

    $parent.find("#{$listItem}, .show-less-toggle").removeClass('is-hidden')
    $(this).addClass('is-hidden')

  $('.show-less-toggle').on 'click', (e) ->
    e.preventDefault()
    $parentClass = $(e.target).data('parentClass')
    $listItem = $(e.target).data('listItem')
    $parent = $(this).closest($parentClass)

    $parent.find($listItem).addClass('is-hidden')
    $parent.find('.show-more-toggle').removeClass('is-hidden')
    $(this).addClass('is-hidden')

  # handle collection preview gem tab switching
  $('.tab-label').on 'click', (e) ->
    $('.tab-label').removeClass('active')
    $currentTab = $(this)
    $currentTab.addClass('active')
    panelId = $currentTab.attr('for')
    $('.tab-panel').addClass('is-hidden')
    $('#' + panelId).removeClass('is-hidden')

    if panelId == 'overview-panel'
      drawSpatialExtent(window.previewSpatial) if window.previewSpatial?
    else
      $('.preview-spatial').remove()
