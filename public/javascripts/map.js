var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
var selectedMarker = undefined;

function initMap(){

  function selectMarker(marker) {
    selectedMarker = marker
    $('#selectedMarker').text(marker.label)
    $("#rateYo").rateYo("option", "rating", marker.rating);
  }

  function createMe(markerItem){
    let pos = {'lat': markerItem.lat, 'lng': markerItem.lng}
    var marker = new google.maps.Marker({
      id: markerItem.id,
      animation: google.maps.Animation.DROP,
      position: pos,
      label: markerItem.label,
      map: map,
      rating: (markerItem.rating / 10),
    });

    google.maps.event.addListener(marker, 'click', () => {
      console.log(google.maps)
      console.log("Marker clicked", marker.id)
      selectMarker(marker);
    })
  }

  $.ajax({
    type: "POST",
    url: `/marker/getAll`,
    success: function(data) {
      //$.each(data, function () {
        console.log(data)
        if(data.length > 0) { // Returns User as 1 element, need more than 1 if data found
          for(let markerItem of data){
            createMe(markerItem)
          }
        }
      //})
    },
    function() {
      handleLocationError(true, map.getCenter());
    }
  })

  function addMarkerClick(location, map) {
    const pos = location
    var marker = new google.maps.Marker({
      id: 0,
      animation: google.maps.Animation.DROP,
      position: pos,
      label: labels[labelIndex++ % labels.length],
      map: map,
      rating: 3.5,
    });

    map.setCenter(pos)
    selectMarker(marker)

    $("#rateYo").rateYo({
      rating: marker.rating
    });

    $.ajax({
      type: "POST",
      url: `/marker/save/1570791732949602`,
      data: { lat: pos.lat, lng: pos.lng, label: marker.label, rating: marker.rating },
      success: function(data) {
        $.each(data, function () {
          marker.id = data.id
        })
      },
      function() {
        handleLocationError(true, map.getCenter());
      }
    })

    function selectMarker(marker) {
      selectedMarker = marker
      console.log("Marker:", marker)
      $('#selectedMarker').text(marker.label)
      $("#rateYo").rateYo("option", "rating", marker.rating);
    }

    google.maps.event.addListener(marker, 'click', _ => {
      selectMarker(marker);
    })
  }

  var deleteMarker = function(marker) {
    marker.setMap(null);
    $.ajax({
      type: "POST",
      url: `/marker/delete`,
      data: { id: marker.id },
      success: function(data) {
        console.log("Deleted")
      },
      function() {
        handleLocationError(true, map.getCenter());
      }
    })
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
    deleteMarker(selectedMarker)
  })


  // $("#rateYo").rateYo("option", "onChange", function () {
    
  //   console.log("this is a new function");
  // }); // returns a jQuery Element
  $(function () {
    $("#rateYo").rateYo({});
  });

  $("#rateYo").on("rateyo.init", function (e, data) {
    $("#rateYo").rateYo("option", "onSet", function (rating, rateYoInstance) {
      $(this).next().text(rating);
      selectedMarker.rating = $("#rateYo").rateYo("option", "rating");
      $.ajax({
        type: "POST",
        url: `/marker/update`,
        data: { id: selectedMarker.id, rating: (selectedMarker.rating * 10) },
        success: function(data) {
          $.each(data, function () {
            console.log(data)
          })
        },
        function() {
          handleLocationError(true, map.getCenter());
        }
      })
    })
  })
}
