var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
var markerCounter = 0;
var markers = [];
var selectedMarker = undefined;
var markerObjs = []

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
      map: map,
      rating: 3.5,
      dbID: 0
    });
    markers[id] = marker
    markerObjs.push(marker)

    map.setCenter(pos)
    selectMarker(marker)

    $("#rateYo").rateYo({
      rating: marker.rating
    });

    $.ajax({
      type: "POST",
      url: `/marker/save/1570791732949602`,
      data: { lat: pos.lat, lng: pos.lng, label: marker.label },
      success: function(data) {
        $.each(data, function () {
          marker.dbID = data.id
        })
      },
      function() {
        handleLocationError(true, map.getCenter());
      }
    })

    function selectMarker(marker) {
      selectedMarker = marker
      $('#selectedMarker').text(marker.label)
      $("#rateYo").rateYo("option", "rating", marker.rating);
    }

    google.maps.event.addListener(marker, 'click', _ => {
      selectMarker(marker);
    })
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

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var infoWindow = new google.maps.InfoWindow({map: map});
      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, map.getCenter());
  }

  google.maps.event.addListener(map, 'click', function(event) {
      addMarkerClick(event.latLng, map);
  });

  google.maps.event.addDomListener(window, 'load', (...args) => {
    const pos = {lat: 37.801, lng: -122.273}
    map.setCenter(pos)
  });

  function handleLocationError(browserHasGeolocation, pos) {
    var infoWindow = new google.maps.InfoWindow({map: map});
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
  }

  $('#deleteMarker').click( event => {
    deleteMarker(selectedMarker.id)
  })


  // $("#rateYo").rateYo("option", "onChange", function () {
    
  //   console.log("this is a new function");
  // }); // returns a jQuery Element
  $(function () {
    $("#rateYo").rateYo({
      onSet: function (rating, rateYoInstance) {
        $(this).next().text(rating);
        console.log(selectedMarker)
        selectedMarker.rating = $("#rateYo").rateYo("option", "rating");
        currentRating = rating
      }
    });
  });
}
