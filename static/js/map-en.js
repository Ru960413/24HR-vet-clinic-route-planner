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
        (err) => reject(`Couldn't get your location (${err})`)
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

  // replace this with fetch (getting data from my API) -> tried but failed
  const markers = [
    {
      id: 1,
      name: "Eden Animal Hospital",
      location: "Taipei_City",
      address:
        "1F., No.33, Beian Rd, Lane 554, Zhongshan District, Taipei City",
      website: "https://eden-vet.com ",
      note: "Call after hours",
      phone: "02-8509-2579",
      lat: "25.08066",
      lng: "121.54849",
    },
    {
      id: 2,
      name: "Top Veterinary Hospital",
      location: "Taipei_City",
      address: "No. 260, Long Jiang Rd, Zhongshan District, Taipei City",
      website: "https://www.topvet.topet.net ",
      note: "Call after hours",
      phone: "09-28242358 or 02-2517-0902 ",
      lat: "25.06001",
      lng: "121.54053",
    },
    {
      id: 3,
      name: "Duke Veterinary Clinic",
      location: "Taipei_City",
      address: "No. 117, Sec. 3, Heping E. Rd., Daan Dist., Taipei City",
      website: "https://www.facebook.com/dukevetclinic ",
      note: "Call after hours",
      phone: "02-8732-4789",
      lat: "25.02644",
      lng: "121.53322",
    },
    {
      id: 4,
      name: "Wang's Veterinary Clinic",
      location: "Taipei_City",
      address: "No. 217, Jinhua St, Daan District, Taipei City",
      website: "https://www.facebook.com/profile.php?id=100044480677446",
      note: "Call after hours or contact via Facebook page",
      phone: "02-2357-0217",
      lat: "25.02992",
      lng: "121.52899",
    },
    {
      id: 5,
      name: "Loving Kindness Animal Hospital (Taipei Branch)",
      location: "Taipei_City",
      address: "No.1, Ningxia Rd, Datong District, Taipei City",
      website: "https://www.lkah.com.tw/ ",
      note: "",
      phone: "02-2556-3320",
      lat: "25.05431",
      lng: "121.51496",
    },
    {
      id: 6,
      name: "Formosa Vet Center",
      location: "Taipei_City",
      address: "1F., No. 247, Minsheng W. Rd., Datong Dist., Taipei City",
      website: "https://www.formosavetcenter.com ",
      note: "",
      phone: "02-2553-0371 or 02-2553-0303 ",
      lat: "25.05719",
      lng: "121.51481",
    },
    {
      id: 7,
      name: "Prospect Vet Emergency Critical Center",
      location: "Taipei_City",
      address: "No.2, Section 2, Zhonghua Rd, Wanhua District, Taipei City",
      website: "https://www.prospect-vet.com ",
      note: "",
      phone: "02-2388-0122",
      lat: "25.03415",
      lng: "121.50559",
    },
    {
      id: 8,
      name: "National Veterinary Hospital(Taipei Branch)",
      location: "Taipei_City",
      address:
        "No. 13, Lane 30, Section 1, Jiuzong Rd, Neihu District, Taipei City",
      website: "https://www.vet.com.tw/en/about.php ",
      note: "",
      phone: "02-8791-8706",
      lat: "25.05774",
      lng: "121.58023",
    },
    {
      id: 9,
      name: "Top Veterinary Hospital(Nanjing branch)",
      location: "Taipei_City",
      address: "No. 286, Sec. 5, Nanjing E. Rd., Songshan Dist., Taipei City",
      website: "http://topvet.topet.net/ ",
      note: "Call after hours",
      phone: "02-2756-2005",
      lat: "25.05104",
      lng: "121.56710",
    },
    {
      id: 10,
      name: "Xintai Animal Hospital",
      location: "Taipei_City",
      address: "1F., No. 57, Yanji St., Songshan Dist., Taipei City",
      website: "http://www.stah.com.tw ",
      note: "",
      phone: "02-2579-5722",
      lat: "25.04497",
      lng: "121.55385",
    },
    {
      id: 11,
      name: "Dacyun Veterinarian 24hr Animal Emergency Hospital",
      location: "Taipei_City",
      address:
        "No. 206, Section 6, Roosevelt Rd, Wenshan District, Taipei City",
      website: "https://dacyun-vet.tw ",
      note: "",
      phone: "02-2930-5557",
      lat: "24.99361",
      lng: "121.54079",
    },
    {
      id: 12,
      name: "Boulder Yard Animal Hospital",
      location: "Taipei_City",
      address:
        "No. 102, Section 1, Zhongcheng Rd, Shilin District, Taipei City",
      website: "http://www.boulderyard24.com ",
      note: "Provide service for dogs, cats, rodents, and rabbits ",
      phone: "02-2834-1119",
      lat: "25.10538",
      lng: "121.52830",
    },
    {
      id: 13,
      name: "Anew Animal Hospital",
      location: "Taipei_City",
      address: "1F., No. 238, Jihe Rd., Shilin Dist., Taipei City",
      website: "https://anewanimalhospital.webnode.tw ",
      note: "Call after hours",
      phone: "02-2881-0478",
      lat: "25.09111",
      lng: "121.52145",
    },
    {
      id: 14,
      name: "Daan Animal Hospital",
      location: "Taipei_City",
      address:
        "1F., No. 162, Sec. 4, Roosevelt Rd., Zhongzheng Dist., Taipei City",
      website: "https://daan-vet.com ",
      note: "",
      phone: "02-2363-2020",
      lat: "25.01239",
      lng: "121.53617",
    },
    {
      id: 15,
      name: "Mutsun Animal Hospital",
      location: "New_Taipei_City",
      address:
        "No. 28, Section 2, Zhongshan Rd, Banqiao District, New Taipei City",
      website: "https://zh-tw.facebook.com/mtpet/",
      note: "Call after hours",
      phone: "02-8951-1172 ",
      lat: "25.01507",
      lng: "121.47272",
    },
    {
      id: 16,
      name: "Chung Ri Animal Hospital",
      location: "New_Taipei_City",
      address:
        "No. 2, Section 3, Zhongshan Rd, Zhonghe District, New Taipei City",
      website: "http://www.unitevet.com ",
      note: "",
      phone: "02-2226-3639",
      lat: "25.00622",
      lng: "121.47980",
    },
    {
      id: 17,
      name: "YaDong Animal Hospital",
      location: "New_Taipei_City",
      address: "2F., No. 639, Zhongshan Rd, Zhonghe District, New Taipei City",
      website: "https://vet639.url.tw/ ",
      note: "Call after hours Provide Service for rabbits, rodents, birds, turtles ",
      phone: "0952-605-051",
      lat: "24.97923",
      lng: "121.52389",
    },
    {
      id: 18,
      name: "Le Huo Animal Hospital",
      location: "New_Taipei_City",
      address: "No. 21, Lane 66, Zhulin Rd, Yonghe District, New Taipei City",
      website:
        "https://www.facebook.com/people/%E6%A8%82%E6%B4%BB%E5%8B%95%E7%89%A9%E9%86%AB%E9%99%A2/100064025791340/",
      note: "Call after hours, Sunday Off",
      phone: "02-2922-5805",
      lat: "25.01306",
      lng: "121.51766",
    },
    {
      id: 19,
      name: "Elite Animal Hospital",
      location: "Taoyuan_City",
      address: "No. 495-9, Minsheng Rd, Taoyuan District, Taoyuan City",
      website: "https://www.ghanimalcasa.com",
      note: "Call after hours",
      phone: "03-336-3252",
      lat: "25.00274",
      lng: "121.30937",
    },
    {
      id: 20,
      name: "Genki Veterinary Hospital(Sanmin Branch)",
      location: "Taoyuan_City",
      address: "No. 381, Section 3, Sanmin Rd, Taoyuan District, Taoyuan City",
      website: "http://www.genkivet.com.tw ",
      note: "",
      phone: "03-333-3816",
      lat: "24.98997",
      lng: "121.30701",
    },
    {
      id: 21,
      name: "Genki Veterinary Hospital(Yiwen Branch)",
      location: "Taoyuan_City",
      address:
        "No. 156, Section 1, Zhuangjing Rd, Taoyuan District, Taoyuan City",
      website: "http://www.genkivet.com.tw ",
      note: "Provide service for dogs, cats, rodents, and rabbits",
      phone: "03-355-3911",
      lat: "25.02555",
      lng: "121.30026",
    },
    {
      id: 22,
      name: "Bisous Animal Hospital",
      location: "Taoyuan_City",
      address: "No. 20, Yanping Rd., Zhongli Dist., Taoyuan City",
      website: "https://www.bisousah.com.tw/",
      note: "",
      phone: "03-453-5740",
      lat: "24.96381",
      lng: "121.23313",
    },
    {
      id: 23,
      name: "Zhu Xin Animal Hospital",
      location: "Hsinchu_City",
      address: "No. 654, Section 1, Jingguo Rd, East District, Hsinchu City",
      website: "http://www.zhuxin.com.tw/",
      note: "Call after hours",
      phone: "03-533-8055",
      lat: "24.81451",
      lng: "120.97447",
    },
    {
      id: 24,
      name: "All Weather Animal Hospital",
      location: "Hsinchu_City",
      address: "1F., No. 255, Guanxin Rd., East Dist., Hsinchu City",
      website: "https://www.facebook.com/allweathervet",
      note: "Service for dogs, cats, rodents, and rabbits",
      phone: "03-668-6356",
      lat: "24.78786",
      lng: "121.02001",
    },
    {
      id: 25,
      name: "Happinesss Animal Hospital",
      location: "Hsinchu_City",
      address:
        "No. 6, Lane 92, Section 3, Jingguo Rd, Xiangshan District, Hsinchu City, 300",
      website: "https://www.facebook.com/HappinesssAnimalHospital/",
      note: "Call after hours Provide service for rodents, sugar gliders, birds, and reptiles",
      phone: "03-530-0175",
      lat: "24.79813",
      lng: "120.95258",
    },
    {
      id: 26,
      name: "Mumustar Animal Hospital",
      location: "Hsinchu_City",
      address:
        "No. 75, South Section, Xianzheng 2nd Rd, Zhubei City, Hsinchu County",
      website: "https://www.facebook.com/profile.php?id=100082868185418",
      note: "Call after hours",
      phone: "03-558-7540",
      lat: "24.81959",
      lng: "121.01270",
    },
    {
      id: 27,
      name: "National Veterinary Hospital(Taichung Main Branch)",
      location: "Taichung_City",
      address: "No. 100, Wuquan 8th St., West Dist., Taichung City",
      website: "https://www.vet.com.tw/en/about.php ",
      note: "",
      phone: "04-2371-0496",
      lat: "24.13410",
      lng: "120.66243",
    },
    {
      id: 28,
      name: "Lodayu Animal Hospital",
      location: "Taichung_City",
      address: "No. 153, Cunzhong St, West Dist., Taichung City",
      website: "https://www.lodayuah.com/",
      note: "Call after hours",
      phone: "04-2372-8378",
      lat: "24.14120",
      lng: "120.65696",
    },
    {
      id: 29,
      name: "Gleam ways Animal Hospital",
      location: "Taichung_City",
      address: "No. 486, Sec. 1, Wenxin Rd., Nantun Dist., Taichung City",
      website: "https://www.facebook.com/gleamways/",
      note: "",
      phone: "04-2320-2279",
      lat: "24.15203",
      lng: "120.64705",
    },
    {
      id: 30,
      name: "Kant Animal Hospital",
      location: "Taichung_City",
      address: "No. 270, Section 2, Chongde Rd, Beitun District, Taichung City",
      website: "https://www.facebook.com/kantvet/",
      note: "Call after hours & Provide service for dogs, cats, rodents, and rabbits ",
      phone: "04-2241-2700",
      lat: "24.17535",
      lng: "120.68592",
    },
    {
      id: 31,
      name: "Muen Animal Hospital",
      location: "Taichung_City",
      address: "No. 865, Jianxing Rd, North District, Taichung City",
      website: "https://www.facebook.com/MuEnAHinTaichung/",
      note: "Call after hours & Sunday Off",
      phone: "04-2207-7271",
      lat: "24.15905",
      lng: "120.66947",
    },
    {
      id: 32,
      name: "Loving Kindness Animal Hospital(Taichung Main branch)",
      location: "Taichung_City",
      address: "No. 539, Sec. 2, Guoguang Rd., Dali Dist., Taichung City",
      website: "https://www.facebook.com/Lkah009/",
      note: "",
      phone: "04-2406-6688",
      lat: "24.11177",
      lng: "120.67890",
    },
    {
      id: 33,
      name: "Chung Ai Veterinary Hospital",
      location: "Changhua_County",
      address:
        "No. 490, Section 2, Zhongshan Rd, Yuanlin City, Changhua County",
      website: "https://www.chungai.com.tw/main/View_Service.aspx ",
      note: "Call after hours",
      phone: "04-833-5520",
      lat: "23.97144",
      lng: "120.57145",
    },
    {
      id: 34,
      name: "Ho Mu Animal Hospital",
      location: "Yunlin_County",
      address: "No. 454, Guangfu Rd, Huwei Township, Yunlin County",
      website: "https://www.facebook.com/profile.php?id=100063877410190",
      note: "Call after hours & Sunday Off",
      phone: "05-633-0811",
      lat: "23.71094",
      lng: "120.43444",
    },
    {
      id: 35,
      name: "National Veterinary Hospital(Tainan Branch)",
      location: "Tainan_City",
      address: "2F., No. 620, Chongde Rd., East Dist., Tainan City",
      website: "https://www.vet.com.tw/en/about.php ",
      note: "",
      phone: "06-267-3191",
      lat: "22.97069",
      lng: "120.22735",
    },
    {
      id: 36,
      name: "Noah Animal Hospital",
      location: "Tainan_City",
      address: "No. 297, Chenggong Rd, West Central District, Tainan City",
      website: "http://www.ky-animal.com.tw/ ",
      note: "Call after hours & Sunday Off",
      phone: "06-221-7291",
      lat: "22.99960",
      lng: "120.20099",
    },
    {
      id: 37,
      name: "Loving Kindness Animal Hospital(Tainan Branch)",
      location: "Tainan_City",
      address: "No. 437, Sec. 1, Ximen Rd., South Dist., Tainan City",
      website: "https://www.lkah.com.tw ",
      note: "",
      phone: "06-220-3166",
      lat: "22.98087",
      lng: "120.19743",
    },
    {
      id: 38,
      name: "Alliance Veterinary Hospital(Renwu Main Branch)",
      location: "Kaohsiung_City",
      address: "No. 231, Fengren Rd., Renwu Dist., Kaohsiung City",
      website: "https://www.pet100pa.com/vet ",
      note: "Emergency service from 9PM to 2AM & Provide service for dogs, cats, rodents, rabbits, hedgehogs, sugar gliders, birds, parrots and reptiles ",
      phone: "07-374-0964",
      lat: "22.69798",
      lng: "120.34697",
    },
    {
      id: 39,
      name: "Hung Li Animal Hospital",
      location: "Kaohsiung_City",
      address: "No. 326, Mingcheng 1st Rd, Sanmin District, Kaohsiung City",
      website: "https://www.hunglivet.com/ ",
      note: "",
      phone: "07-310-2819",
      lat: "22.65998",
      lng: "120.32480",
    },
    {
      id: 40,
      name: "Jong-Shing Animal Hospital",
      location: "Kaohsiung_City",
      address: "No. 498, Wenfu Rd, Zuoying District, Kaohsiung City",
      website: "http://www.jsah.com.tw/ ",
      note: "Provide emergency service from 9:30PM to 2AM ",
      phone: "07-350-2020",
      lat: "22.69134",
      lng: "120.31671",
    },
    {
      id: 41,
      name: "Udoch Animal Hospital",
      location: "Kaohsiung_City",
      address: "No. 139, Zhongzheng 1st Rd, Lingya District, Kaohsiung City",
      website: "https://udochah.wixsite.com/udoch ",
      note: "Press the emergency bell at the door if service needed",
      phone: "07-722-0804",
      lat: "22.62834",
      lng: "120.33086",
    },
    {
      id: 42,
      name: "GuanAn Animal Hospital",
      location: "Kaohsiung_City",
      address: "No. 131-1, Zhongzheng 2nd Rd, Lingya District, Kaohsiung City",
      website: "",
      note: "Call after hours",
      phone: "07-223-6451",
      lat: "22.63023",
      lng: "120.31555",
    },
    {
      id: 43,
      name: "Hope Veterinary Hospital",
      location: "Kaohsiung_City",
      address: "No. 100, Kaixuan Rd, Fengshan District, Kaohsiung City",
      website: "https://www.facebook.com/HopeVMHospital/",
      note: "Call after hours",
      phone: "07-753-7300",
      lat: "22.60749",
      lng: "120.35881",
    },
    {
      id: 44,
      name: "MingRen Veterinary Hospital",
      location: "Pingtung_County",
      address: "No. 7, Ren'ai Rd, Pingtung City, Pingtung County",
      website:
        "https://www.facebook.com/people/%E5%90%8D%E4%BB%81%E6%AF%9B%E5%B0%8F%E5%AD%A9%E9%86%AB%E9%99%A2/100064113933440/",
      note: "Call after hours",
      phone: "08-751-2022",
      lat: "22.66802",
      lng: "120.49102",
    },
    {
      id: 45,
      name: "Shanghai Animal Hospital",
      location: "Hualien_County",
      address: "No. 63, Shanghai St, Hualien City, Hualien County",
      website: "",
      note: "Call after hours",
      phone: "03-834-1853",
      lat: "23.97294",
      lng: "121.60216",
    },
    {
      id: 46,
      name: "Sensateion Animal Emergency Hospital",
      location: "New_Taipei_City",
      address: "No. 129, Zhongfu Rd, Linkou District, New Taipei City",
      website: "https://www.sensationah.com/",
      note: "",
      phone: "02-2609-0119",
      lat: "25.07729",
      lng: "121.36158",
    },
  ];
  // console.log(markers); //--> Get undefined(SOLVED)

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
            `<strong>Clinic name: ${m["name"]}</strong><br>Address: ${
              m["address"]
            }
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
          infoWindow.open(map, marker);
        };
      })(marker)
    );
    marker.setMap(map);
  });
}

window.initMap = initMap;
//use Distance matrix API to calculate the transport time between user and vet clinics(within 20 km?) Not Sure how
