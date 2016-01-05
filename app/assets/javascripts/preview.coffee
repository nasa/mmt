# Functions used for drawing on the preview page's map image

drawPoint = (x, y, dotSize, highlightColor) ->
  style = "position:absolute;width:#{dotSize}px;height:#{dotSize}px;top:#{y}px;left:#{x}px;background:#{highlightColor}"
  $('<div />', class: 'preview-spatial', style: style).appendTo($('body'))

drawRectangle = (minX, minY, maxX, maxY, highlightColor) ->
  style = "position:absolute;width:#{maxX - minX}px;height:#{maxY - minY}px;top:#{minY}px;left:#{minX}px;background:#{highlightColor}"
  $('<div />', class: 'preview-spatial', style: style).appendTo($('body'))

previewSpatial = {}

@drawSpatialExtent = (previewSpatialHash) ->
  previewSpatial = previewSpatialHash
  $('.preview-spatial').remove()

  mapPosition = $('#preview_map').offset()
  mapX1 = mapPosition.left
  mapY1 = mapPosition.top
  highlightColor = 'rgba(250,0,0,0.25)'
  $coordinates = $('#coordinates')

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
  drawSpatialExtent(previewSpatial)
