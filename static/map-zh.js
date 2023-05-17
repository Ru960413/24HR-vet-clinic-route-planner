//Reference: https://www.youtube.com/watch?v=VlY2byIcE9M&ab_channel=GeoDev
//Reference: https://towardsdatascience.com/integrating-google-maps-api-using-python-and-javascript-149fdba27b99

let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 24.1906155, lng: 120.5882385 },
    zoom: 8,
  });

  // const myLocation = new google.maps.Marker({
  //   position: { lat: 24.1908835, lng: 120.5882498 },
  //   label: "我",
  // });

  // myLocation.setMap(map);

  //Get user current position
  //Reference: https://ithelp.ithome.com.tw/articles/10191242

  // making sure we can access geolocation through user's device
  if (navigator.geolocation) {
    // if successful:
    navigator.geolocation.getCurrentPosition(
      function (position) {
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
        map.setZoom(11);

        //Bug: this is not working(SOLVE) --> because I'm passing in the wrong parameter lol(shouldn't pass in myLocation, just its lat and log): setCenter(latlng)
        //set the center of the map to myLocation's latitude and longitude
        map.setCenter(pos);

        //reset myLocation marker on map
        myLocation.setMap(map);

        alert("請點選任一地標已檢視更多的資訊");
        // TODO: add an else statement to render an apology when user didn't allow access
      },
      function () {
        alert("無法定位您的位置");
      }
    );

    //else if not successful
  } else {
    // Browser doesn't support Geolocation
    alert("發生了一些錯誤，導致無法抓取您的位置!");
  }

  // replace this with fetch (getting data from my API)
  const markers = [
    {
      id: 1,
      name: "伊甸動物醫院",
      location: "台北市",
      address: "台北市中山區北安路554巷33號1樓",
      website: "https://eden-vet.com ",
      note: "9PM後，須先以電話聯絡",
      phone: "02-8509-2579",
      lat: "25.08019",
      lng: "121.54958",
    },
    {
      id: 2,
      name: "太僕動物醫院（龍江院）",
      location: "台北市",
      address: "台北市中山區龍江路260號",
      website: "https://www.topvet.topet.net ",
      note: "9PM後，須先以電話聯絡",
      phone: "09-28242358",
      lat: "25.06001",
      lng: "121.54053",
    },
    {
      id: 3,
      name: "杜克動物醫院",
      location: "台北市",
      address: "台北市大安區和平東路三段117號",
      website: "https://www.dukevet.com.tw/",
      note: "12AM後，須先以電話聯絡",
      phone: "02-8732-4789",
      lat: "25.02454",
      lng: "121.55143",
    },
    {
      id: 4,
      name: "王樣動物醫院",
      location: "台北市",
      address: "台北市大安區金華街217號",
      website:
        "https://www.facebook.com/people/%E7%8E%8B%E6%A8%A3%E5%8B%95%E7%89%A9%E9%86%AB%E9%99%A2/100044480677446/",
      note: "須先以電話聯絡",
      phone: "02-2357-0217",
      lat: "25.02992",
      lng: "121.52899",
    },
    {
      id: 5,
      name: "慈愛動物醫院（台北總院）",
      location: "台北市",
      address: "台北市大同區寧夏路1號",
      website: "https://www.lkah.com.tw/ ",
      note: "",
      phone: "02-2556-3320",
      lat: "25.05422",
      lng: "121.51495",
    },
    {
      id: 6,
      name: "全民動物醫院",
      location: "台北市",
      address: "台北市大同區民生西路249號",
      website: "https://www.formosavetcenter.com",
      note: "",
      phone: "02-2553-0371",
      lat: "25.05718",
      lng: "121.51468",
    },
    {
      id: 7,
      name: "展望動物醫院",
      location: "台北市",
      address: "台北市萬華區中華路二段二號",
      website: "https://www.prospect-vet.com ",
      note: "",
      phone: "02-2388-0122",
      lat: "25.02871",
      lng: "121.50527",
    },
    {
      id: 8,
      name: "全國動物醫院（台北分院）",
      location: "台北市",
      address: "台北市內湖區舊宗路一段30巷13號",
      website: "https://www.vet.com.tw ",
      note: "",
      phone: "02-8791-8706",
      lat: "25.05774",
      lng: "121.58023",
    },
    {
      id: 9,
      name: "太僕動物醫院(南京院)",
      location: "台北市",
      address: "台北市松山區南京東路五段286號",
      website: "http://topvet.topet.net/ ",
      note: "9PM後，須先以電話聯絡",
      phone: "02-2756-2005",
      lat: "25.05104",
      lng: "121.56710",
    },
    {
      id: 10,
      name: "興泰動物醫院",
      location: "台北市",
      address: "台北市松山區延吉街57號",
      website: "http://www.stah.com.tw ",
      note: "",
      phone: "02-2579-5722",
      lat: "25.04497",
      lng: "121.55385",
    },
    {
      id: 11,
      name: "大群動物醫院",
      location: "台北市",
      address: "台北市文山區羅斯福路六段206號",
      website: "https://dacyun-vet.tw ",
      note: "",
      phone: "02-2930-5557",
      lat: "24.99361",
      lng: "121.54079",
    },
    {
      id: 12,
      name: "布達羊急診動物醫院",
      location: "台北市",
      address: "台北市士林區忠誠路一段102號",
      website: "http://www.boulderyard24.com ",
      note: "為犬、貓、鼠、兔服務 ",
      phone: "02-2834-1119",
      lat: "25.10538",
      lng: "121.52830",
    },
    {
      id: 13,
      name: "阿牛犬貓急診醫院",
      location: "台北市",
      address: "台北市士林區基河路238號1樓",
      website: "https://anewanimalhospital.webnode.tw ",
      note: "10PM後，週日5PM後，須先以電話聯絡",
      phone: "02-2881-0478",
      lat: "25.09112",
      lng: "121.52143",
    },
    {
      id: 14,
      name: "大安動物醫院",
      location: "台北市",
      address: "台北市中正區羅斯福路四段162號1樓",
      website: "https://daan-vet.com ",
      note: "",
      phone: "02-2363-2020",
      lat: "25.01239",
      lng: "121.53617",
    },
    {
      id: 15,
      name: "牧村動物醫院",
      location: "新北市",
      address: "新北市板橋區中山路二段28號",
      website: "https://www.facebook.com/mtpet/",
      note: "8PM後，須先以電話聯絡 & 週日休息",
      phone: "02-8951-1172",
      lat: "25.01507",
      lng: "121.47272",
    },
    {
      id: 16,
      name: "中日動物醫院",
      location: "新北市",
      address: "新北市中和區中山路三段2號",
      website: "http://www.unitevet.com ",
      note: "",
      phone: "02-2226-3639",
      lat: "25.00622",
      lng: "121.47980",
    },
    {
      id: 17,
      name: "亞東動物醫院",
      location: "新北市",
      address: "新北市中和區中正路639號2樓",
      website: "https://vet639.url.tw/ ",
      note: "須先以電話聯絡 服務對象：犬、貓、鼠、兔、鳥、龜 ",
      phone: "0952-605-051",
      lat: "24.99556",
      lng: "121.48506",
    },
    {
      id: 18,
      name: "樂活動物醫院",
      location: "新北市",
      address: "新北市永和區中興街107號",
      website:
        "https://www.facebook.com/people/%E6%A8%82%E6%B4%BB%E5%8B%95%E7%89%A9%E9%86%AB%E9%99%A2/100064025791340/",
      note: "9PM-2AM，須先以電話聯絡 週日休",
      phone: "02-2922-5805",
      lat: "25.01219",
      lng: "121.51809",
    },
    {
      id: 19,
      name: "上弦動物醫院",
      location: "新北市",
      address: "新北市林口區忠福路129號",
      website: "https://www.sensationah.com/",
      note: "",
      phone: "02-2609-0119",
      lat: "25.07729",
      lng: "121.36158",
    },
    {
      id: 20,
      name: "品湛動物醫院",
      location: "桃園市",
      address: "桃園市桃園區民生路495-9號",
      website: "https://www.ghanimalcasa.com ",
      note: "2AM後，須先以電話聯絡",
      phone: "03-336-3252",
      lat: "25.00274",
      lng: "121.30937",
    },
    {
      id: 21,
      name: "元氣動物醫院（三民總院）",
      location: "桃園市",
      address: "桃園市桃園區三民路三段381號",
      website: "http://www.genkivet.com.tw ",
      note: "",
      phone: "03-333-3816",
      lat: "24.98997",
      lng: "121.30701",
    },
    {
      id: 22,
      name: "元氣動物醫院（藝文分院）",
      location: "桃園市",
      address: "桃園市桃園區莊敬路一段156號",
      website: "http://www.genkivet.com.tw ",
      note: "服務對象：犬、貓、鼠、兔",
      phone: "03-355-3911",
      lat: "25.02555",
      lng: "121.30026",
    },
    {
      id: 23,
      name: "磨鼻子動物醫院",
      location: "桃園市",
      address: "桃園市中壢區延平路20號",
      website: "https://www.bisousah.com.tw/",
      note: "",
      phone: "03-453-5740",
      lat: "24.96381",
      lng: "121.23313",
    },
    {
      id: 24,
      name: "築心動物醫院",
      location: "新竹市",
      address: "新竹市東區經國路一段654號",
      website: "http://www.zhuxin.com.tw/ ",
      note: "9PM～2AM 提供急診服務",
      phone: "03-533-8055",
      lat: "24.81451",
      lng: "120.97447",
    },
    {
      id: 25,
      name: "全天候動物醫院",
      location: "新竹市",
      address: "新竹市東區關新路225號1樓",
      website: "https://www.facebook.com/allweathervet",
      note: "服務對象：犬貓、鼠兔",
      phone: "03-668-6356",
      lat: "24.78786",
      lng: "121.02001",
    },
    {
      id: 26,
      name: "大福小幸動物醫院",
      location: "新竹市",
      address: "新竹市香山區經國路三段92巷6號",
      website: "https://www.facebook.com/HappinesssAnimalHospital/",
      note: "須先以電話聯絡 服務對象：犬貓、鼠兔、蜜袋鼯、鳥、爬蟲等 ",
      phone: "03-530-0175",
      lat: "24.79813",
      lng: "120.95258",
    },
    {
      id: 27,
      name: "沐暮星動物醫院",
      location: "新竹縣",
      address: "新竹縣竹北市縣政二路南段75號",
      website: "https://www.facebook.com/profile.php?id=100082868185418",
      note: "",
      phone: "03-558-7540",
      lat: "24.81959",
      lng: "121.01270",
    },
    {
      id: 28,
      name: "全國動物醫院（台中總院）",
      location: "台中市",
      address: "台中市西區五權八街100號",
      website: "https://www.vet.com.tw ",
      note: "",
      phone: "04-2371-0496",
      lat: "24.13410",
      lng: "120.66243",
    },
    {
      id: 29,
      name: "羅大宇動物醫院",
      location: "台中市",
      address: "台中市西區存中街153號號",
      website: "https://www.lodayuah.com/",
      note: "服務時間： 9:30PM 到 11PM",
      phone: "04-2372-8378",
      lat: "24.14120",
      lng: "120.65696",
    },
    {
      id: 30,
      name: "格林威治動物醫院",
      location: "台中市",
      address: "台中市南屯區文心路一段486號",
      website: "https://www.facebook.com/gleamways/",
      note: "",
      phone: "04-2320-2279",
      lat: "24.15203",
      lng: "120.64705",
    },
    {
      id: 31,
      name: "康德動物醫院",
      location: "台中市",
      address: "台中市北屯區崇德路二段270號",
      website: "https://www.facebook.com/kantvet/",
      note: "24小時急診 & 須先以電話聯絡  服務對象：犬、貓、鼠、兔 ",
      phone: "04-2241-2700",
      lat: "24.17535",
      lng: "120.68592",
    },
    {
      id: 32,
      name: "沐恩動物醫院",
      location: "台中市",
      address: "台中市北區健行路865號",
      website: "https://www.facebook.com/MuEnAHinTaichung/",
      note: "須先以電話聯絡 & 週日休息",
      phone: "04-2207-7271",
      lat: "24.15905",
      lng: "120.66947",
    },
    {
      id: 33,
      name: "慈愛動物醫院-台中總院",
      location: "台中市",
      address: "台中市大里區國光路二段539號",
      website: "https://www.facebook.com/Lkah009/",
      note: "",
      phone: "04-2406-6688",
      lat: "24.11177",
      lng: "120.67890",
    },
    {
      id: 34,
      name: "忠愛動物醫院",
      location: "彰化縣",
      address: "彰化縣員林市中山路二段490號",
      website: "https://www.chungai.com.tw/main/View_Service.aspx ",
      note: "須先以電話聯絡",
      phone: "04-833-5520",
      lat: "23.97144",
      lng: "120.57145",
    },
    {
      id: 35,
      name: "和牧動物醫院",
      location: "雲林縣",
      address: "雲林縣虎尾鎮光復路454號",
      website: "https://www.facebook.com/profile.php?id=100063877410190",
      note: "須先以電話聯絡 & 週日休息",
      phone: "05-633-0811",
      lat: "23.71094",
      lng: "120.43444",
    },
    {
      id: 36,
      name: "全國動物醫院（台南分院）",
      location: "台南市",
      address: "台南市東區崇德路620號2樓",
      website: "https://www.vet.com.tw ",
      note: "",
      phone: "06-267-3191",
      lat: "22.97069",
      lng: "120.22735",
    },
    {
      id: 37,
      name: "諾亞動物醫院",
      location: "台南市",
      address: "台南市中西區成功路297號",
      website: "http://www.ky-animal.com.tw/ ",
      note: "須先以電話聯絡 & 週日休息",
      phone: "06-221-7291",
      lat: "22.99960",
      lng: "120.20099",
    },
    {
      id: 38,
      name: "慈愛動物醫院（台南總院）",
      location: "台南市",
      address: "台南市南區西門路一段473號",
      website: "https://www.lkah.com.tw ",
      note: "",
      phone: "06-220-3166",
      lat: "22.98206",
      lng: "120.19749",
    },
    {
      id: 39,
      name: "聯盟動物醫院（仁武總院）",
      location: "高雄市",
      address: "高雄市仁武區鳳仁路231號E棟",
      website: "https://www.pet100pa.com/vet ",
      note: "9PM 到 2AM 提供急診服務 & 服務對象：犬貓、鼠兔、刺蝟、蜜袋鼯、鳥、鸚鵡、爬蟲等 ",
      phone: "07-374-0964",
      lat: "22.69796",
      lng: "120.34655",
    },
    {
      id: 40,
      name: "宏力動物醫院",
      location: "高雄市",
      address: "高雄市三民區明誠一路326號",
      website: "https://www.hunglivet.com/ ",
      note: "",
      phone: "07-310-2819",
      lat: "22.65998",
      lng: "120.32480",
    },
    {
      id: 41,
      name: "中興梅西動物醫療中心",
      location: "高雄市",
      address: "高雄市左營區文府路498號",
      website: "http://www.jsah.com.tw/ ",
      note: "9PM 到 2AM 提供急診服務 ",
      phone: "07-350-2020",
      lat: "22.69134",
      lng: "120.31671",
    },
    {
      id: 42,
      name: "烏鐸動物醫院",
      location: "高雄市",
      address: "高雄市苓雅區中正一路139號",
      website: "https://udochah.wixsite.com/udoch ",
      note: "夜間急診請按“急診鈴”",
      phone: "07-722-0804",
      lat: "22.62834",
      lng: "120.33086",
    },
    {
      id: 43,
      name: "冠安動物醫院",
      location: "高雄市",
      address: "高雄市苓雅區中正二路131-1號",
      website: "",
      note: "9:30PM後，週日5:30PM後，須先以電話聯絡",
      phone: "07-223-6451",
      lat: "22.63023",
      lng: "120.31555",
    },
    {
      id: 44,
      name: "希望動物醫院",
      location: "高雄市",
      address: "高雄市鳳山區凱旋路100號",
      website: "https://www.facebook.com/HopeVMHospital/",
      note: "須先以電話聯絡",
      phone: "07-753-7300",
      lat: "22.60749",
      lng: "120.35881",
    },
    {
      id: 45,
      name: "名仁毛小孩動物醫院",
      location: "屏東縣",
      address: "屏東縣屏東市仁愛路7號",
      website: "https://www.facebook.com/profile.php?id=100064113933440",
      note: "須先以電話聯絡",
      phone: "08-751-2022",
      lat: "22.66802",
      lng: "120.49102",
    },
    {
      id: 46,
      name: "上海動物醫院",
      location: "花蓮縣",
      address: "花蓮縣花蓮市上海街63號",
      website: "",
      note: "須先以電話聯絡",
      phone: "03-834-1853",
      lat: "23.97294",
      lng: "121.60216",
    },
  ];
  //add vet clinics as markers on google map(using forEach)

  let infoWindow = new google.maps.InfoWindow({});

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
            `<strong>醫院名稱: ${m["name"]}</strong><br>地址： ${
              m["address"]
            }<br><strong>備註： ${
              m["note"] || "無"
            }</strong><br>電話： <a href="${m["phone"].replaceAll("-", "")}">${
              m["phone"]
            }</a><br>網站：<a href="${m["website"].replaceAll(" ", "")}">${
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
}
window.initMap = initMap;
