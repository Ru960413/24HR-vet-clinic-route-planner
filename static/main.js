//Get user current position

// 先確認使用者裝置能不能抓地點
if (navigator.geolocation) {
  // 使用者不提供權限，或是發生其它錯誤
  function error() {
    alert("無法取得你的位置");
  }

  // 使用者允許抓目前位置，回傳經緯度
  function success(position) {
    console.log(position.coords.latitude, position.coords.longitude);
  }

  // 跟使用者拿所在位置的權限
  navigator.geolocation.getCurrentPosition(success, error);
} else {
  alert("Sorry, 你的裝置不支援地理位置功能。");
}

// function initMap() {
//   const bounds = new google.maps.LatLngBounds();
//   const markersArray = [];
//   const map = new google.maps.Map(document.getElementById("map-en"), {
//     center: { lat: 24.1520315, lng: 120.6470502 },
//     zoom: 10,
//   });
//   // initialize services
//   const geocoder = new google.maps.Geocoder();
//   const service = new google.maps.DistanceMatrixService();
//   // build request
//   const origin1 = { lat: 24.1908835, lng: 120.5882498 };
//   const destinationA = { lat: 24.1520315, lng: 120.6470502 };
//   const destinationB = { lat: 24.1340956, lng: 120.6624304 };
//   const request = {
//     origins: [origin1],
//     destinations: [destinationA, destinationB],
//     travelMode: google.maps.TravelMode.DRIVING,
//     unitSystem: google.maps.UnitSystem.METRIC,
//     avoidHighways: false,
//     avoidTolls: false,
//   };

//   // put request on page
//   document.getElementById("request").innerText = JSON.stringify(
//     request,
//     null,
//     2
//   );
//   // get distance matrix response
//   service.getDistanceMatrix(request).then((response) => {
//     // put response
//     document.getElementById("response").innerText = JSON.stringify(
//       response,
//       null,
//       2
//     );

//     // show on map
//     const originList = response.originAddresses;
//     const destinationList = response.destinationAddresses;

//     deleteMarkers(markersArray);

//     const showGeocodedAddressOnMap = (asDestination) => {
//       const handler = ({ results }) => {
//         map.fitBounds(bounds.extend(results[0].geometry.location));
//         markersArray.push(
//           new google.maps.Marker({
//             map,
//             position: results[0].geometry.location,
//             label: asDestination ? "D" : "O",
//           })
//         );
//       };
//       return handler;
//     };

//     for (let i = 0; i < originList.length; i++) {
//       const results = response.rows[i].elements;

//       geocoder
//         .geocode({ address: originList[i] })
//         .then(showGeocodedAddressOnMap(false));

//       for (let j = 0; j < results.length; j++) {
//         geocoder
//           .geocode({ address: destinationList[j] })
//           .then(showGeocodedAddressOnMap(true));
//       }
//     }
//   });
// }

// function deleteMarkers(markersArray) {
//   for (let i = 0; i < markersArray.length; i++) {
//     markersArray[i].setMap(null);
//   }

//   markersArray = [];
// }

// window.initMap = initMap;
