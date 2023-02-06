//Get user current position

// making sure we can access geolocation through user's device
if (navigator.geolocation) {
  // if not successful:
  function error() {
    alert("Can't access your location");
  }

  // if successful:
  function success(position) {
    console.log(position.coords.latitude, position.coords.longitude);
    // return position.coords.latitude, position.coords.longitude;
  }

  navigator.geolocation.getCurrentPosition(success, error);
} else {
  alert("Sorry,your device doesn't support geolocation");
}

// set the center of the map to the user's current location
// let originPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

let map;
// let user_lat = position.coords.latitude;
// let user_lng = position.coords.longitude;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 24.1906155, lng: 120.5882385 },
    zoom: 8,
  });
}

window.initMap = initMap;
//add vet clinics as markers on google map(use loop)

//use Distance matrix API to calculate the transport time between user and vet clinics(within 20 km?) Not Sure how
