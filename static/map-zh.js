//Reference: https://www.youtube.com/watch?v=VlY2byIcE9M&ab_channel=GeoDev
//Reference: https://towardsdatascience.com/integrating-google-maps-api-using-python-and-javascript-149fdba27b99

let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 24.1906155, lng: 120.5882385 },
    zoom: 8,
  });

  const myLocation = new google.maps.Marker({
    position: { lat: 24.1908835, lng: 120.5882498 },
    label: "我",
  });

  myLocation.setMap(map);

  //Get user current position
  //Reference: https://ithelp.ithome.com.tw/articles/10191242

  // making sure we can access geolocation through user's device
  if (navigator.geolocation) {
    // if successful:
    navigator.geolocation.getCurrentPosition(function (position) {
      // set the position variable to the user's current latitude and longitude
      let pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      alert("已抓到您的位置，請稍等");
      // update myLocation with the new variable
      let myLocation = new google.maps.Marker({
        position: pos,
        label: "我",
        map: map,
      });
      // zoom in the map
      map.setZoom(12);

      //Bug: this is not working(SOLVE) --> because I'm passing in the wrong parameter lol(shouldn't pass in myLocation, just its lat and log): setCenter(latlng)
      //set the center of the map to myLocation's latitude and longitude
      map.setCenter(pos);

      //reset myLocation marker on map
      myLocation.setMap(map);

      alert("請點選任一地標已檢視更多的資訊");
      // TODO: add an else statement to render an apology when user didn't allow access
    });

    //else if not successful
  } else {
    // Browser doesn't support Geolocation
    alert("發生了一些錯誤，導致無法抓取您的位置!");
  }

  const markers = [
    {
      name: "伊甸動物醫院",
      address: "台北市中山區北安路554巷33號1樓",
      website: "https://eden-vet.com ",
      note: "9PM後，須先以電話聯絡",
      phone: "02-8509-2579",
      lat: 25.080186,
      lng: 121.5495754,
    },
    {
      name: "太僕動物醫院（龍江院）",
      address: "台北市中山區龍江路260號",
      website: "https://www.topvet.topet.net ",
      note: "9PM後，須先以電話聯絡",
      phone: "09-28242358 or 02-2517-0902 ",
      lat: 25.0600094,
      lng: 121.5405291,
    },
    {
      name: "杜克動物醫院",
      address: "台北市大安區和平東路三段117號",
      website: "Facebook ",
      note: "12AM後，須先以電話聯絡",
      phone: "02-8732-4789",
      lat: 25.0245417,
      lng: 121.5514283,
    },
    {
      name: "王樣動物醫院",
      address: "台北市大安區金華街217號",
      website: "Facebook ",
      note: "須先以電話聯絡",
      phone: "02-2357-0217",
      lat: 25.029917,
      lng: 121.528995,
    },
    {
      name: "慈愛動物醫院（台北總院）",
      address: "台北市大同區寧夏路1號",
      website: "https://www.lkah.com.tw/ ",
      note: "",
      phone: "02-2556-3320",
      lat: 25.0542156,
      lng: 121.5149476,
    },
    {
      name: "全民動物醫院",
      address: "台北市大同區民生西路249號",
      website: "https://www.formosavetcenter.com ",
      note: "",
      phone: "02-2553-0371 or 02-2553-0303 ",
      lat: 25.0571799,
      lng: 121.5146794,
    },
    {
      name: "展望動物醫院",
      address: "台北市萬華區中華路二段二號",
      website: "https://www.prospect-vet.com ",
      note: "",
      phone: "02-2388-0122",
      lat: 25.0287057,
      lng: 121.5052712,
    },
    {
      name: "全國動物醫院（台北分院）",
      address: "台北市內湖區舊宗路一段30巷13號",
      website: "https://www.vet.com.tw ",
      note: "",
      phone: "02-8791-8706",
      lat: 25.0577388,
      lng: 121.5802343,
    },
    {
      name: "太僕動物醫院(南京院)",
      address: "台北市松山區南京東路五段286號",
      website: "http://topvet.topet.net/ ",
      note: "9PM後，須先以電話聯絡",
      phone: "02-2756-2005",
      lat: 25.0510364,
      lng: 121.5671031,
    },
    {
      name: "興泰動物醫院",
      address: "台北市松山區延吉街57號",
      website: "http://www.stah.com.tw ",
      note: "",
      phone: "02-2579-5722",
      lat: 25.0449721,
      lng: 121.5538535,
    },
    {
      name: "大群動物醫院",
      address: "台北市文山區羅斯福路六段206號",
      website: "https://dacyun-vet.tw ",
      note: "",
      phone: "02-2930-5557",
      lat: 24.9936051,
      lng: 121.5407931,
    },
    {
      name: "布達羊急診動物醫院",
      address: "台北市士林區忠誠路一段102號",
      website: "http://www.boulderyard24.com ",
      note: "為犬、貓、鼠、兔服務 ",
      phone: "02-2834-1119",
      lat: 25.1053842,
      lng: 121.5282977,
    },
    {
      name: "阿牛犬貓急診醫院",
      address: "台北市士林區基河路238號1樓",
      website: "https://anewanimalhospital.webnode.tw ",
      note: "10PM後，週日5PM後，須先以電話聯絡",
      phone: "02-2881-0478",
      lat: 25.0911191,
      lng: 121.5214287,
    },
    {
      name: "藍天家畜醫院",
      address: "台北市士林區文林路759號",
      website: "Facebook Page ",
      note: "9PM後，須先以電話聯絡 週日休息 & 服務對象：犬、貓、鳥、兔、魚 ",
      phone: "02-2838-0088",
      lat: 25.103274,
      lng: 121.519365,
    },
    {
      name: "大安動物醫院",
      address: "台北市中正區羅斯福路四段162號1樓",
      website: "https://daan-vet.com ",
      note: "",
      phone: "02-2363-2020",
      lat: 25.0123936,
      lng: 121.5361745,
    },
    {
      name: "翔心動物醫院",
      address: "新北市板橋區忠孝路203號",
      website: "https://www.hsianghsin.tw ",
      note: "9PM後，須先以電話聯絡",
      phone: "02-2956-9099",
      lat: 25.0027793,
      lng: 121.4652805,
    },
    {
      name: "牧村動物醫院",
      address: "新北市板橋區中山路二段28號",
      website: "Facebook Page ",
      note: "8PM後，須先以電話聯絡 & 週日休息",
      phone: "02-8951-1172 ",
      lat: 25.0150678,
      lng: 121.4727188,
    },
    {
      name: "中日動物醫院",
      address: "新北市中和區中山路三段2號",
      website: "http://www.unitevet.com ",
      note: "",
      phone: "02-2226-3639",
      lat: 25.0062233,
      lng: 121.4798046,
    },
    {
      name: "亞東動物醫院",
      address: "新北市中和區中正路639號2樓",
      website: "https://vet639.url.tw/ ",
      note: "須先以電話聯絡 服務對象：犬、貓、鼠、兔、鳥、龜 ",
      phone: "0952-605-051",
      lat: 24.995565,
      lng: 121.485059,
    },
    {
      name: "樂活動物醫院",
      address: "新北市永和區中興街107號",
      website: "Facebook Page",
      note: "9PM-2AM，須先以電話聯絡 週日休",
      phone: "02-2922-5805",
      lat: 25.0121862,
      lng: 121.5180885,
    },
    {
      name: "品湛動物醫院",
      address: "桃園市桃園區民生路495-9號",
      website: "https://www.ghanimalcasa.com ",
      note: "2AM後，須先以電話聯絡",
      phone: "03-336-3252",
      lat: 25.0027364,
      lng: 121.3093662,
    },
    {
      name: "元氣動物醫院（三民總院）",
      address: "桃園市桃園區三民路三段381號",
      website: "http://www.genkivet.com.tw ",
      note: "",
      phone: "03-333-3816",
      lat: 24.9899693,
      lng: 121.307013,
    },
    {
      name: "元氣動物醫院（藝文分院）",
      address: "桃園市桃園區莊敬路一段156號",
      website: "http://www.genkivet.com.tw ",
      note: "服務對象：犬、貓、鼠、兔",
      phone: "03-355-3911",
      lat: 25.0255521,
      lng: 121.3002566,
    },
    {
      name: "磨鼻子動物醫院",
      address: "桃園市中壢區延平路20號",
      website: "Facebook Page ",
      note: "",
      phone: "03-453-5740",
      lat: 24.9638073,
      lng: 121.2331266,
    },
    {
      name: "築心動物醫院",
      address: "新竹市東區經國路一段654號",
      website: "http://www.zhuxin.com.tw/ ",
      note: "9PM～2AM 提供急診服務",
      phone: "03-533-8055",
      lat: 24.8145088,
      lng: 120.9744711,
    },
    {
      name: "大福小幸動物醫院",
      address: "新竹市香山區經國路三段92巷6號",
      website: "Facebook ",
      note: "須先以電話聯絡 服務對象：犬貓、鼠兔、蜜袋鼯、鳥、爬蟲等 ",
      phone: "03-530-0175",
      lat: 24.798127,
      lng: 120.95258,
    },
    {
      name: "全國動物醫院（台中總院）",
      address: "台中市西區五權八街100號",
      website: "https://www.vet.com.tw ",
      note: "",
      phone: "04-2371-0496",
      lat: 24.1340956,
      lng: 120.6624304,
    },
    {
      name: "羅大宇動物醫院",
      address: "台中市西區存中街153號號",
      website: "Facebook Page ",
      note: "服務時間： 9:30PM 到 11PM",
      phone: "04-2372-8378",
      lat: 24.1411981,
      lng: 120.6569647,
    },
    {
      name: "格林威治動物醫院",
      address: "台中市南屯區文心路一段486號",
      website: "Facebook ",
      note: "",
      phone: "04-2320-2279",
      lat: 24.1520315,
      lng: 120.6470502,
    },
    {
      name: "康德動物醫院",
      address: "台中市北屯區崇德路二段270號",
      website: "Facebook Page ",
      note: "24小時急診 & 須先以電話聯絡  服務對象：犬、貓、鼠、兔 ",
      phone: "04-2241-2700",
      lat: 24.175348,
      lng: 120.6859193,
    },
    {
      name: "沐恩動物醫院",
      address: "台中市北區健行路865號",
      website: "Facebook ",
      note: "須先以電話聯絡 & 週日休息",
      phone: "04-2207-7271",
      lat: 24.159047,
      lng: 120.6694723,
    },
    {
      name: "慈愛動物醫院-台中總院",
      address: "台中市大里區國光路二段539號",
      website: "Facebook Page ",
      note: "",
      phone: "04-2406-6688",
      lat: 24.1117741,
      lng: 120.6788988,
    },
    {
      name: "忠愛動物醫院",
      address: "彰化縣員林市中山路二段490號",
      website: "https://www.chungai.com.tw/main/View_Service.aspx ",
      note: "須先以電話聯絡",
      phone: "04-833-5520",
      lat: 23.9714398,
      lng: 120.5714543,
    },
    {
      name: "和牧動物醫院",
      address: "雲林縣虎尾鎮光復路454號",
      website: "Facebook ",
      note: "須先以電話聯絡 & 週日休息",
      phone: "05-633-0811",
      lat: 23.7109443,
      lng: 120.4344367,
    },
    {
      name: "全國動物醫院（台南分院）",
      address: "台南市東區崇德路620號2樓",
      website: "https://www.vet.com.tw ",
      note: "",
      phone: "06-267-3191",
      lat: 22.9706936,
      lng: 120.2273543,
    },
    {
      name: "諾亞動物醫院",
      address: "台南市中西區成功路297號",
      website: "http://www.ky-animal.com.tw/ ",
      note: "須先以電話聯絡 & 週日休息",
      phone: "06-221-7291",
      lat: 22.9995962,
      lng: 120.2009944,
    },
    {
      name: "慈愛動物醫院（台南總院）",
      address: "台南市南區西門路一段473號",
      website: "https://www.lkah.com.tw ",
      note: "",
      phone: "06-220-3166",
      lat: 22.9820613,
      lng: 120.1974914,
    },
    {
      name: "聯盟動物醫院（仁武總院）",
      address: "高雄市仁武區鳳仁路231號E棟",
      website: "https://www.pet100pa.com/vet ",
      note: "9PM 到 2AM 提供急診服務 & 服務對象：犬貓、鼠兔、刺蝟、蜜袋鼯、鳥、鸚鵡、爬蟲等 ",
      phone: "07-374-0964 #20",
      lat: 22.6979627,
      lng: 120.3465459,
    },
    {
      name: "宏力動物醫院",
      address: "高雄市三民區明誠一路326號",
      website: "https://www.hunglivet.com/ ",
      note: "",
      phone: "07-310-2819",
      lat: 22.659977,
      lng: 120.324799,
    },
    {
      name: "中興梅西動物醫療中心",
      address: "高雄市左營區文府路498號",
      website: "http://www.jsah.com.tw/ ",
      note: "9PM 到 2AM 提供急診服務 ",
      phone: "07-350-2020#431",
      lat: 22.6913366,
      lng: 120.3167105,
    },
    {
      name: "烏鐸動物醫院",
      address: "高雄市苓雅區中正一路139號",
      website: "https://udochah.wixsite.com/udoch ",
      note: "夜間急診請按“急診鈴”",
      phone: "07-722-0804",
      lat: 22.628337,
      lng: 120.330864,
    },
    {
      name: "冠安動物醫院",
      address: "高雄市苓雅區中正二路131-1號",
      website: "",
      note: "9:30PM後，週日5:30PM後，須先以電話聯絡",
      phone: "07-223-6451",
      lat: 22.630227,
      lng: 120.315545,
    },
    {
      name: "希望動物醫院",
      address: "高雄市鳳山區凱旋路100號",
      website: "Facebook ",
      note: "須先以電話聯絡",
      phone: "07-753-7300",
      lat: 22.6074945,
      lng: 120.3588147,
    },
    {
      name: "名仁動物醫院",
      address: "屏東縣屏東市仁愛路7號",
      website: "Facebook ",
      note: "須先以電話聯絡",
      phone: "08-751-2022",
      lat: 22.6680245,
      lng: 120.4910189,
    },
    {
      name: "上海動物醫院",
      address: "花蓮縣花蓮市上海街63號",
      website: "",
      note: "須先以電話聯絡",
      phone: "03-834-1853",
      lat: 23.9729448,
      lng: 121.6021628,
    },
  ];
  //add vet clinics as markers on google map(using forEach)

  let infoWindow = new google.maps.InfoWindow({});

  markers.forEach((m) => {
    //--> Error: cannot read properties as undefined
    marker = new google.maps.Marker({
      position: { lat: m["lat"], lng: m["lng"] },
      map: map,
      draggable: false,
    });
    google.maps.event.addListener(
      marker,
      "click",
      (function (marker) {
        return function () {
          infoWindow.setContent(
            `<strong>醫院名稱: ${m["name"]}</strong><br>地址: ${
              m["address"]
            }<br><strong>備註: ${
              m["note"] || "無"
            }</strong><br>電話: <a href="${m["phone"].replaceAll("-", "")}">${
              m["phone"]
            }</a><br><a href="https://www.google.com/maps/dir/?api=1&destination=${
              m["lat"]
            },${m["lng"]}&travelmode=driving" target="blank">導航</a>`
          );
          infoWindow.open(map, marker);
        };
      })(marker)
    );
    marker.setMap(map);
  });
}
window.initMap = initMap;
