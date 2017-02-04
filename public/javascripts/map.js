// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;

function addMarkerClick(location, map) {
  const pos = location
  var marker = new google.maps.Marker({
    position: pos,
    title: 'Pothole Location',
    label: labels[labelIndex++ % labels.length],
    map: map
  });

  infoWindow.setPosition(pos);
  map.setCenter(pos)

  $.ajax({
    type: "POST",
    url: `/marker/save/1570791732949602`,
    data: { lat: pos.lat, lng: pos.lng, label: marker.label },
    success: function() {
      //window.location.reload()
      console.log("This is working!")
    },
    function() {
      handleLocationError(true, infoWindow, map.getCenter());
    }
  })

}

var map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: 37.801, lng: -122.273},
  zoom: 18
});
var infoWindow = new google.maps.InfoWindow({map: map});

google.maps.event.addListener(map, 'click', function(event) {
  navigator.geolocation.getCurrentPosition( function(position) {
    var latLng = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }
    addMarkerClick(event.latLng, map);
  })
});




google.maps.event.addDomListener(window, 'load', (...args) => {
  const pos = {lat: 37.801, lng: -122.273}
  infoWindow.setPosition(pos);
  map.setCenter(pos)
});

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
}
