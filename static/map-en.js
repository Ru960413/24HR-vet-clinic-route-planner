// //Get user current position

// // making sure we can access geolocation through user's device
// if (navigator.geolocation) {
//   // if not successful:
//   function error() {
//     alert("Can't access your location");
//   }

//   // if successful:
//   function success(position) {
//     console.log(position.coords.latitude, position.coords.longitude);
//     // return position.coords.latitude, position.coords.longitude;
//   }

//   navigator.geolocation.getCurrentPosition(success, error);
// } else {
//   alert("Sorry,your device doesn't support geolocation");
// }

// set the center of the map to the user's current location
// let originPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

let map;
// let user_lat = position.coords.latitude;
// let user_lng = position.coords.longitude;

function initMap(data) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 24.1906155, lng: 120.5882385 },
    zoom: 10,
  });

  const myLocation = new google.maps.Marker({
    position: { lat: 24.1908835, lng: 120.5882498 },
    label: "Me",
  });
  myLocation.setMap(map);

  //Don't really understand
  //add vet clinics as markers on google map(using loop)
  data.forEach((element) => {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(element["lat"], element["lng"]),
      map: map,
      title: element["name"],
    });
    google.maps.event.addEventListener(marker, "click", function (marker) {
      return function () {
        infoWindow.setContent(
          `Clinic name: ${element["name"]}<br>Address: ${element["address"]}<br>Note: ${element["note"]}<br>Phone-number: ${element["phone"]}`
        );
        infoWindow.open(map, marker);
      };
    })(marker);
  });
}

window.initMap = initMap;
//use Distance matrix API to calculate the transport time between user and vet clinics(within 20 km?) Not Sure how

// function initMap(data) {

//   var center = {lat: data[0][`latitude`], data[0][`longitude`]};
//   var map = new google.maps.Map(document.getElementById('map'), {
//       zoom: 4,
//       center: center
//   });

//   var infowindow =  new google.maps.InfoWindow({});
//   var marker;

//   data.forEach(e => {
//       marker = new google.maps.Marker({
//       position: new google.maps.LatLng(e[`latitude`], e[`longitude`]),
//       map: map,
//       title: e[`address`],
//   });
//       google.maps.event.addListener(marker, 'click', (function (marker) {
//           return function () {
//               infowindow.setContent(`State: ${e[`state`]<br>County: ${e[`location`]}<br>Address: ${e[`address`]}`);
//               infowindow.open(map, marker);
//           }
//       })(marker));
//   });
// }
