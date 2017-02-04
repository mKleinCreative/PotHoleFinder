var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
var markerCounter = 0;
var markers = [];

function uniqueId(){
  return ++markerCounter;
}

function initMap(){
  function addMarkerClick(location, map) {
    const pos = location
    const id = uniqueId()
    var marker = new google.maps.Marker({
      id: id,
      animation: google.maps.Animation.DROP,
      position: pos,
      label: labels[labelIndex++ % labels.length],
      map: map
    });
    markers[id] = marker

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

    google.maps.event.addListener(marker, 'click', _ => {
      deleteMarker(id)
    });
  }

  var deleteMarker = function(id) {
    var marker = markers[id]; // find the marker by given id
    marker.setMap(null);
    marker[id] = null
  }

  var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 37.801, lng: -122.273},
      zoom: 18
    });
  var infoWindow = new google.maps.InfoWindow({map: map});
  infoWindow.close()

  google.maps.event.addListener(map, 'click', function(event) {
      addMarkerClick(event.latLng, map);
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
}
