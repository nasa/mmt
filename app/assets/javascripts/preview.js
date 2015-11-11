$(document).ready(function() {

  $('#legend').leanModal({
    top: 200,
    overlay: 0.6,
  });

});

// Functions used for drawing on the preview page's map image

function drawPoint(x, y, dotSize, highlightColor) {
  var dot = '<div style="position:absolute;width:' + dotSize + 'px;height:' + dotSize + 'px;top:' + y + 'px;left:' + x + 'px;background:' + highlightColor +'"></div>';
  document.body.innerHTML += dot;
}

function drawRectangle(minX, minY, maxX, maxY, highlightColor) {
  var rect = '<div style="position:absolute;width:' + (maxX-minX) + 'px;height:' + (maxY-minY) + 'px;top:' + minY + 'px;left:' + minX + 'px;background:' + highlightColor +'"></div>';
  document.body.innerHTML += rect;
}

function drawSpatialExtent(previewSpatialHash) {

  var mapPosition = $('#preview_map').offset();
  var mapX1 = mapPosition.left;
  var mapY1 = mapPosition.top;

  var highlightColor = "rgba(250,0,0,0.25)";

  var pointCoordinateArrayJson = previewSpatialHash['point_coordinate_array'];
  var rectangleCoordinateArrayJson = previewSpatialHash['rectangle_coordinate_array'];

  var i;

  if (pointCoordinateArrayJson) {
    for (i = 0; i < pointCoordinateArrayJson.length; i++) {
      var point = pointCoordinateArrayJson[i];
      var dotSize = 5;
      drawPoint(point['x'] + mapX1, point['y'] + mapY1, dotSize, highlightColor);
      document.getElementById("coordinates").innerHTML +=
        "<li>Lat: " + point['lat'] + "</li>" +
        "<li>Lon: " + point['lon'] + "</li></br>";  // TODO - UI dev - remove </br>
    }
  }

  if (rectangleCoordinateArrayJson) {
    for (i = 0; i < rectangleCoordinateArrayJson.length; i++) {
      var rectangle = rectangleCoordinateArrayJson[i];
      drawRectangle(rectangle['min_x'] + mapX1, rectangle['min_y'] + mapY1, rectangle['max_x'] + mapX1, rectangle['max_y'] + mapY1, highlightColor);
      document.getElementById("coordinates").innerHTML +=
        "<li>N: " + rectangle['north_bounding_coordinate'] + "</li>" +
        "<li>S: " + rectangle['south_bounding_coordinate'] + "</li>" +
        "<li>E: " + rectangle['east_bounding_coordinate'] + "</li>" +
        "<li>W: " + rectangle['west_bounding_coordinate'] + "</li></br>"; // TODO - UI dev - remove </br>*/
    }
  }

  if ( (!pointCoordinateArrayJson || !pointCoordinateArrayJson.length) && (!rectangleCoordinateArrayJson || !rectangleCoordinateArrayJson.length) ) {
    document.getElementById("coordinates").innerHTML = "<li>No Spatial Coordinates found</li>";
  }

}
