//Get user current position

// 先確認使用者裝置能不能抓地點
if (navigator.geolocation) {
  // 使用者不提供權限，或是發生其它錯誤
  function error() {
    alert("Can't access your location");
  }

  // 使用者允許抓目前位置，回傳經緯度
  function success(position) {
    console.log(position.coords.latitude, position.coords.longitude);
  }

  // 跟使用者拿所在位置的權限
  navigator.geolocation.getCurrentPosition(success, error);
} else {
  alert("Sorry,your device doesn't support geolocation");
}

// set the center of the map to the user's current location
let originPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);


//add vet clinics as markers on google map(use loop)


//use Distance matrix API to calculate the transport time between user and vet clinics(within 20 km?) Not Sure how 