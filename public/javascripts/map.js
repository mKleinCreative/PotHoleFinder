var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
var selectedMarker = undefined;

function initMap(){

  function selectMarker(marker) {
    selectedMarker = marker
    $('#image').attr("src",'/img' + marker.id)
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
      // draggable: true,
      // icon: 'https://pbs.twimg.com/profile_images/608604270347223041/ko5Erkaw.png',
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
            labelIndex++
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
      // draggable: true,
      // icon: 'https://pbs.twimg.com/profile_images/608604270347223041/ko5Erkaw.png',
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
      $('#image').attr("src",'/img' + marker.id)
      $('#selectedMarker').text(marker.label)
      $("#rateYo").rateYo("option", "rating", marker.rating);
    }

    google.maps.event.addListener(marker, 'click', _ => {
      selectMarker(marker);
    })
  }

  var deleteMarker = function(marker) {
    selectedMarker = null
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
      infoWindow.setContent('You are here.');
      // map.setCenter(pos);
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




// Yo, uploader below





$('.upload-btn').on('click', function (){
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});

$('#upload-input').on('change', function(){

  var files = $(this).get(0).files;

  if (files.length > 0){
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      // add the files to formData object for the data payload
      formData.append('uploads[]', file, file.name);
    }

    if(selectedMarker){
      $.ajax({
        url: '/upload/' + selectedMarker.id,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data){
            console.log('upload successful!\n' + data);
            $('#image').attr("src",'/img' + selectedMarker.id)
        },
        xhr: function() {
          // create an XMLHttpRequest
          var xhr = new XMLHttpRequest();

          // listen to the 'progress' event
          xhr.upload.addEventListener('progress', function(evt) {

            if (evt.lengthComputable) {
              // calculate the percentage of upload completed
              var percentComplete = evt.loaded / evt.total;
              percentComplete = parseInt(percentComplete * 100);

              // update the Bootstrap progress bar with the new percentage
              $('.progress-bar').text(percentComplete + '%');
              $('.progress-bar').width(percentComplete + '%');

              // once the upload reaches 100%, set the progress bar text to done
              if (percentComplete === 100) {
                $('.progress-bar').html('Done');
              }

            }

          }, false);

          return xhr;
        }
      });
    } else {
      alert("You must select or create a marker to associate the image with!")
    }

  }
});
