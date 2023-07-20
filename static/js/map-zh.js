//Reference: https://www.youtube.com/watch?v=VlY2byIcE9M&ab_channel=GeoDev
//Reference: https://towardsdatascience.com/integrating-google-maps-api-using-python-and-javascript-149fdba27b99

let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 24.1906155, lng: 120.5882385 },
    zoom: 8,
  });

  // making sure we can access geolocation through user's device
  const getPosition = function () {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (err) => {
          reject(`Couldn't get your location`);
          alert(`無法找到您現在的位置 (${err.message})`);
        }
      );
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };
  getPosition().then((position) => {
    const pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    alert("已找到您的位置，請稍後片刻");
    // update myLocation with the new variable
    let myLocation = new google.maps.Marker({
      position: pos,
      label: "我",
      map: map,
    });
    // zoom in the map
    map.setZoom(11);

    //Bug: this is not working(SOLVE) --> because I'm passing in the wrong parameter lol(shouldn't pass in myLocation, just its lat and log): setCenter(latlng)
    //set the center of the map to myLocation's latitude and longitude
    map.setCenter(pos);

    //reset myLocation marker on map
    myLocation.setMap(map);
    alert("請點選任意的圖釘以查看位置的細節");
  });
  const markers = [];

  fetch("https://24hrvetapiv3-production.up.railway.app/v3/clinics/zh")
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      data.forEach((data) => markers.push(data));
      // passing in the markers from data got from fetching Vet API
      renderMarkers(markers);
    });

  const renderMarkers = function (markers) {
    let infoWindow = new google.maps.InfoWindow({});

    //add vet clinics as markers on google map(using forEach)
    markers.forEach((m) => {
      //--> Error: cannot read properties as undefined
      marker = new google.maps.Marker({
        position: { lat: Number(m["lat"]), lng: Number(m["lng"]) },
        map: map,
        draggable: false,
      });
      google.maps.event.addListener(
        marker,
        "click",
        (function (marker) {
          return function () {
            infoWindow.setContent(
              `<strong>${m["name"]}</strong><br>地址： ${
                m["address"]
              }<br><strong>備註： ${
                m["note"] || "無"
              }</strong><br>電話： <a href="${m["phone"].replaceAll(
                "-",
                ""
              )}">${m["phone"]}</a><br>網站：<a href="${m["website"].replaceAll(
                " ",
                ""
              )}">${
                m["website"]
              }</a><br><button><a href="https://www.google.com/maps/dir/?api=1&destination=${Number(
                m["lat"]
              )},${Number(
                m["lng"]
              )}&travelmode=driving" target="blank">導航</a></button>`
            );
            infoWindow.open(map, marker);
          };
        })(marker)
      );
      marker.setMap(map);
    });
  };
}
window.initMap = initMap;
