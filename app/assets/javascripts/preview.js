
// Functions used for drawing on the preview page's map image

function draw_point(x, y, dot_size, highlight_color) {
  var dot = '<div style="position:absolute;width:' + dot_size + 'px;height:' + dot_size + 'px;top:' + y + 'px;left:' + x + 'px;background:' + highlight_color +'"></div>';
  document.body.innerHTML += dot;
}

function draw_rectangle(min_x, min_y, max_x, max_y, highlight_color) {
  var rect = '<div style="position:absolute;width:' + (max_x-min_x) + 'px;height:' + (max_y-min_y) + 'px;top:' + min_y + 'px;left:' + min_x + 'px;background:' + highlight_color +'"></div>';
  document.body.innerHTML += rect;
}

function draw_spatial_extent(point_coordinate_array_json, rectangle_coordinate_array_json) {
  var map_position = $('#preview_map').offset();
  var map_x1 = map_position.left;
  var map_y1 = map_position.top;

  var highlight_color = "rgba(250,0,0,0.25)"

  for (i=0; i<point_coordinate_array_json.length;i++) {
    var point = point_coordinate_array_json[i];
    var dot_size = 5;
    draw_point(point['x'] + map_x1, point['y'] + map_y1, dot_size, highlight_color);
    document.getElementById("coordinates").innerHTML +=
      "<li>Lat: " + point['lat'] + "</li>" +
      "<li>Lon: " + point['lon'] + "</li></br>";  // TODO - UI dev - remove </br>
  }

  for (i=0; i<rectangle_coordinate_array_json.length;i++) {
    var rectangle = rectangle_coordinate_array_json[i];
    draw_rectangle( rectangle['min_x'] + map_x1, rectangle['min_y'] + map_y1,rectangle['max_x'] + map_x1, rectangle['max_y'] + map_y1, highlight_color);
    document.getElementById("coordinates").innerHTML +=
      "<li>N: " + rectangle['nbc'] + "</li>" +
      "<li>S: " + rectangle['sbc'] + "</li>" +
      "<li>E: " + rectangle['ebc'] + "</li>" +
      "<li>W: " + rectangle['wbc'] + "</li></br>"; // TODO - UI dev - remove </br>*/
  }

  if (point_coordinate_array_json.length == 0 && rectangle_coordinate_array_json.length == 0)
    document.getElementById("coordinates").innerHTML = "<li>No Spatial Coordinates found</li>";

}
