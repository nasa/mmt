# Functions used for drawing on the preview page's map image

drawPoint = (x, y, dotSize, highlightColor) ->
  pointStyle = "position:absolute;"
  pointStyle += "width:#{dotSize}px;"
  pointStyle += "height:#{dotSize}px;"
  pointStyle += "top:#{y}px;"
  pointStyle += "left:#{x}px;"
  pointStyle += "background:#{highlightColor}"
  $('<div />',
    class: 'preview-spatial',
    style: pointStyle).appendTo($('body')
  )

drawRectangle = (minX, minY, maxX, maxY, highlightColor) ->
  rectangleStyle = "position:absolute;"
  rectangleStyle += "width:#{maxX - minX}px;"
  rectangleStyle += "height:#{maxY - minY}px;"
  rectangleStyle += "top:#{minY}px;"
  rectangleStyle += "left:#{minX}px;"
  rectangleStyle += "background:#{highlightColor}"
  $('<div />',
    class: 'preview-spatial',
    style: rectangleStyle).appendTo($('body')
  )

previewSpatial = {}

@drawSpatialExtent = (previewSpatialHash) ->
  previewSpatial = previewSpatialHash
  $('.preview-spatial').remove()

  mapPosition = $('#preview-map').offset()
  mapX1 = mapPosition.left
  mapY1 = mapPosition.top
  highlightColor = 'rgba(250,0,0,0.25)'

  for point in previewSpatialHash.point_coordinate_array
    dotSize = 5
    drawPoint point.x + mapX1, point.y + mapY1, dotSize, highlightColor

  for rectangle in previewSpatialHash.rectangle_coordinate_array
    minX = rectangle.min_x + mapX1
    minY = rectangle.min_y + mapY1
    maxX = rectangle.max_x + mapX1
    maxY = rectangle.max_y + mapY1
    drawRectangle minX, minY, maxX, maxY, highlightColor

# on window resize, redraw the spatial preview
$(window).resize ->
  drawSpatialExtent(window.previewSpatial) if window.previewSpatial?

# using window on load vs document ready waits until all images are loaded
# so the correct coordinates are gathered for mapPosition
# http://stackoverflow.com/questions/544993/official-way-to-ask-jquery-wait-for-all-images-to-load-before-executing-somethin
$(window).on 'load', ->
  drawSpatialExtent(window.previewSpatial) if window.previewSpatial?
