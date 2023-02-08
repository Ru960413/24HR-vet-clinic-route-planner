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
    label: "我",
  });

  myLocation.setMap(map);
}
window.initMap = initMap;
