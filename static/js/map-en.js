//Reference: https://www.youtube.com/watch?v=VlY2byIcE9M&ab_channel=GeoDev
//Reference: https://towardsdatascience.com/integrating-google-maps-api-using-python-and-javascript-149fdba27b99
//Reference: https://stackoverflow.com/questions/28395255/dynamically-link-to-google-maps-route-planner-and-always-use-car-as-preferred-fo
let map;

function initMap() {
  // Initialize map with a set of latitude and longitude
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
          reject(`Couldn't get your location (${err})`);
          alert(`Couldn't get your location`);
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
    alert("Got your location! Just a sec...");
    // update myLocation with the new variable
    let myLocation = new google.maps.Marker({
      position: pos,
      label: "Me",
      map: map,
    });
    // zoom in the map
    map.setZoom(11);

    //Bug: this is not working(SOLVE) --> because I'm passing in the wrong parameter lol(shouldn't pass in myLocation, just its lat and log): setCenter(latlng)
    //set the center of the map to myLocation's latitude and longitude
    map.setCenter(pos);

    //reset myLocation marker on map
    myLocation.setMap(map);
    alert("Click on any of the markers to see more info");
  });

  const markers = [];

  fetch("https://24hrvetapiv3-production.up.railway.app/v3/clinics/en")
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      data.forEach((data) => markers.push(data));
      // passing in the markers from data got from fetching Vet API
      renderMarkers(markers);
    });

  const renderMarkers = function (markers) {
    let infoWindow = new google.maps.InfoWindow({});
    // add vet clinics as markers on google map(using forEach)
    markers.forEach((m) => {
      console.log(m);
      marker = new google.maps.Marker({
        position: { lat: Number(m["lat"]), lng: Number(m["lng"]) },
        map: map,
        draggable: false,
      });
      google.maps.event.addListener(
        marker,
        "click",
        (function (markers) {
          return function () {
            infoWindow.setContent(
              `<strong>${m["name"]}</strong><br>Address: ${m["address"]}
              <br><strong>Note: ${
                m["note"] || "none"
              }</strong><br>Phone Number: <a href="${m["phone"].replaceAll(
                "-",
                ""
              )}">${m["phone"]}</a><br>Website: <a href="${m[
                "website"
              ].replaceAll(" ", "")}">${
                m["website"]
              }</a><br><button><a href="https://www.google.com/maps/dir/?api=1&destination=${Number(
                m["lat"]
              )},${Number(
                m["lng"]
              )}&travelmode=driving" target="blank">Get Direction</a></button>`
            );
            infoWindow.open(map, markers);
          };
        })(marker)
      );
      marker.setMap(map);
    });
  };
}

window.initMap = initMap;
//use Distance matrix API to calculate the transport time between user and vet clinics(within 20 km?) Not Sure how
