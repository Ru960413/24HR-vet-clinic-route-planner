//Reference: https://www.youtube.com/watch?v=VlY2byIcE9M&ab_channel=GeoDev
//Reference: https://towardsdatascience.com/integrating-google-maps-api-using-python-and-javascript-149fdba27b99
//Reference: https://stackoverflow.com/questions/28395255/dynamically-link-to-google-maps-route-planner-and-always-use-car-as-preferred-fo
let map;

function initMap() {
  // Question: How to set the center of the map and myLocation to user's current location?

  // Initialize map with a set of latitude and longitude
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 24.1906155, lng: 120.5882385 },
    zoom: 8,
  });

  // And then set my location
  let myLocation = new google.maps.Marker({
    position: { lat: 24.1906155, lng: 120.5882385 },
    label: "Me",
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
      alert("Got your location! Just a sec...");
      // update myLocation with the new variable
      let myLocation = new google.maps.Marker({
        position: pos,
        label: "Me",
        map: map,
      });
      // zoom in the map
      map.setZoom(12);

      //Bug: this is not working(SOLVE) --> because I'm passing in the wrong parameter lol(shouldn't pass in myLocation, just its lat and log): setCenter(latlng)
      //set the center of the map to myLocation's latitude and longitude
      map.setCenter(pos);

      //reset myLocation marker on map
      myLocation.setMap(map);

      alert("Click on any of the markers to see more info");
      // TODO: add an else statement to render an apology when user didn't allow access
    });

    //else if not successful
  } else {
    // Browser doesn't support Geolocation or user didn't allow access
    alert("Error!");
  }

  const markers = [
    {
      name: "Eden Animal Hospital",
      address:
        "1F., No.33, Beian Rd, Lane 554, Zhongshan District, Taipei City",
      website: "https://eden-vet.com ",
      note: "Call after 9PM",
      phone: "02-8509-2579",
      lat: 25.0806586,
      lng: 121.5484874,
    },
    {
      name: "Top Veterinary Hospital",
      address: "No. 260, Long Jiang Rd, Zhongshan District, Taipei City",
      website: "https://www.topvet.topet.net ",
      note: "Call after 9PM",
      phone: "09-28242358 or 02-2517-0902 ",
      lat: 25.0600094,
      lng: 121.5405291,
    },
    {
      name: "Duke Veterinary Clinic",
      address: "No. 117, Sec. 3, Heping E. Rd., Daan Dist., Taipei City",
      website: "https://www.facebook.com/dukevetclinic ",
      note: "Call after 12AM",
      phone: "02-8732-4789",
      lat: 25.02644,
      lng: 121.5332197,
    },
    {
      name: "Wang's Veterinary Clinic",
      address: "No. 217, Jinhua St, Daan District, Taipei City",
      website: "Facebook Page ",
      note: "Call before going or contact via Facebook page",
      phone: "02-2357-0217",
      lat: 25.029917,
      lng: 121.528995,
    },
    {
      name: "Loving Kindness Animal Hospital",
      address: "No.1, Ningxia Rd, Datong District, Taipei City",
      website: "https://www.lkah.com.tw/ ",
      note: "",
      phone: "02-2556-3320",
      lat: 25.0543129,
      lng: 121.5149591,
    },
    {
      name: "Formosa Vet Center",
      address: "1F., No. 247, Minsheng W. Rd., Datong Dist., Taipei City",
      website: "https://www.formosavetcenter.com ",
      note: "",
      phone: "02-2553-0371 or 02-2553-0303 ",
      lat: 25.057185,
      lng: 121.514809,
    },
    {
      name: "Prospect Vet Emergency Critical Center",
      address: "No.2, Section 2, Zhonghua Rd, Wanhua District, Taipei City",
      website: "https://www.prospect-vet.com ",
      note: "",
      phone: "02-2388-0122",
      lat: 25.0341472,
      lng: 121.5055855,
    },
    {
      name: "National Veterinary Hospital(Taipei Branch)",
      address:
        "No. 13, Lane 30, Section 1, Jiuzong Rd, Neihu District, Taipei City",
      website: "https://www.vet.com.tw/en/about.php ",
      note: "",
      phone: "02-8791-8706",
      lat: 25.0577388,
      lng: 121.5802343,
    },
    {
      name: "Top Veterinary Hospital(Nanjing branch)",
      address: "No. 286, Sec. 5, Nanjing E. Rd., Songshan Dist., Taipei City",
      website: "http://topvet.topet.net/ ",
      note: "Call After 9 PM",
      phone: "02-2756-2005",
      lat: 25.0510364,
      lng: 121.5671031,
    },
    {
      name: "Xintai Animal Hospital",
      address: "1F., No. 57, Yanji St., Songshan Dist., Taipei City",
      website: "http://www.stah.com.tw ",
      note: "",
      phone: "02-2579-5722",
      lat: 25.0449721,
      lng: 121.5538535,
    },
    {
      name: "Dacyun Veterinarian 24hr Animal Emergency Hospital",
      address:
        "No. 206, Section 6, Roosevelt Rd, Wenshan District, Taipei City",
      website: "https://dacyun-vet.tw ",
      note: "",
      phone: "02-2930-5557",
      lat: 24.9936051,
      lng: 121.5407931,
    },
    {
      name: "Boulder Yard Animal Hospital",
      address:
        "No. 102, Section 1, Zhongcheng Rd, Shilin District, Taipei City",
      website: "http://www.boulderyard24.com ",
      note: "Provide service for dogs, cats, rodents, and rabbits ",
      phone: "02-2834-1119",
      lat: 25.1053842,
      lng: 121.5282977,
    },
    {
      name: "Anew Animal Hospital",
      address: "1F., No. 238, Jihe Rd., Shilin Dist., Taipei City",
      website: "https://anewanimalhospital.webnode.tw ",
      note: "Call After 10PM & Sunday After 5PM",
      phone: "02-2881-0478",
      lat: 25.0911086,
      lng: 121.5214455,
    },
    {
      name: "Blue Sky Animal Hospital",
      address: "No. 757, Wenlin Rd, Shilin District, Taipei City",
      website: "Facebook Page ",
      note: "Call After 9PM & Sunday Off  Provide service for dogs, cats, birds, fish, and rabbits ",
      phone: "02-2838-0088",
      lat: 25.103235,
      lng: 121.519392,
    },
    {
      name: "Daan Animal Hospital",
      address:
        "1F., No. 162, Sec. 4, Roosevelt Rd., Zhongzheng Dist., Taipei City",
      website: "https://daan-vet.com ",
      note: "",
      phone: "02-2363-2020",
      lat: 25.0123932,
      lng: 121.5361749,
    },
    {
      name: "Hsiang Hsin Animal Hospital",
      address: "No. 203, Zhongxiao Rd., Banqiao Dist., New Taipei City",
      website: "https://www.hsianghsin.tw ",
      note: "Call after 9PM",
      phone: "02-2956-9099",
      lat: 25.0027793,
      lng: 121.4652805,
    },
    {
      name: "Mutsun Animal Hospital",
      address:
        "No. 28, Section 2, Zhongshan Rd, Banqiao District, New Taipei City",
      website: "Facebook Page ",
      note: "Call after 8PM",
      phone: "02-8951-1172 ",
      lat: 25.0150678,
      lng: 121.4727188,
    },
    {
      name: "Chung Ri Animal Hospital",
      address:
        "No. 2, Section 3, Zhongshan Rd, Zhonghe District, New Taipei City",
      website: "http://www.unitevet.com ",
      note: "",
      phone: "02-2226-3639",
      lat: 25.0062233,
      lng: 121.4798046,
    },
    {
      name: "YaDong Animal Hospital",
      address: "2F., No. 639, Zhongshan Rd, Zhonghe District, New Taipei City",
      website: "https://vet639.url.tw/ ",
      note: "Call before going Provide Service for rabbits, rodents, birds, turtles ",
      phone: "0952-605-051",
      lat: 24.9792305,
      lng: 121.523889,
    },
    {
      name: "Le Huo Animal Hospital",
      address: "No. 21, Lane 66, Zhulin Rd, Yonghe District, New Taipei City",
      website: "Facebook Page",
      note: "Call between 9PM to 2AM, Sunday Off",
      phone: "02-2922-5805",
      lat: 25.0130624,
      lng: 121.5176627,
    },
    {
      name: "Elite Animal Hospital",
      address: "No. 495-9, Minsheng Rd, Taoyuan District, Taoyuan City",
      website: "https://www.ghanimalcasa.com ",
      note: "Call After 2AM",
      phone: "03-336-3252",
      lat: 25.0027364,
      lng: 121.3093662,
    },
    {
      name: "Genki Veterinary Hospital(Sanmin Branch)",
      address: "No. 381, Section 3, Sanmin Rd, Taoyuan District, Taoyuan City",
      website: "http://www.genkivet.com.tw ",
      note: "",
      phone: "03-333-3816",
      lat: 24.9899693,
      lng: 121.307013,
    },
    {
      name: "Genki Veterinary Hospital(Yiwen Branch)",
      address:
        "No. 156, Section 1, Zhuangjing Rd, Taoyuan District, Taoyuan City",
      website: "http://www.genkivet.com.tw ",
      note: "Provide service for dogs, cats, rodents, and rabbits",
      phone: "03-355-3911",
      lat: 25.0255521,
      lng: 121.3002566,
    },
    {
      name: "Bisous Animal Hospital",
      address: "No. 20, Yanping Rd., Zhongli Dist., Taoyuan City",
      website: "Facebook Page ",
      note: "",
      phone: "03-453-5740",
      lat: 24.9638073,
      lng: 121.2331266,
    },
    {
      name: "Zhu Xin Animal Hospital",
      address: "No. 654, Section 1, Jingguo Rd, East District, Hsinchu City",
      website: "http://www.zhuxin.com.tw/ ",
      note: "Provide Service from 9PM to 2AM",
      phone: "03-533-8055",
      lat: 24.8145088,
      lng: 120.9744711,
    },
    {
      name: "Happinesss Animal Hospital",
      address:
        "No. 6, Lane 92, Section 3, Jingguo Rd, Xiangshan District, Hsinchu City, 300 ",
      website: "Facebook Page ",
      note: "Call before going Provide service for rodents, sugar gliders, birds, and reptiles ",
      phone: "03-530-0175",
      lat: 24.798127,
      lng: 120.95258,
    },
    {
      name: "National Veterinary Hospital(Taichung Main Branch)",
      address: "No. 100, Wuquan 8th St., West Dist., Taichung City",
      website: "https://www.vet.com.tw/en/about.php ",
      note: "",
      phone: "04-2371-0496",
      lat: 24.1340956,
      lng: 120.6624304,
    },
    {
      name: "Lodayu Animal Hospital",
      address: "No. 153, Cunzhong St, West Dist., Taichung City",
      website: "Facebook Page ",
      note: "Provide service from 9:30PM to 11PM",
      phone: "04-2372-8378",
      lat: 24.1411981,
      lng: 120.6569647,
    },
    {
      name: "Gleam ways Animal Hospital",
      address: "No. 486, Sec. 1, Wenxin Rd., Nantun Dist., Taichung City",
      website: "Facebook Page ",
      note: "",
      phone: "04-2320-2279",
      lat: 24.1520315,
      lng: 120.6470502,
    },
    {
      name: "Kant Animal Hospital",
      address: "No. 270, Section 2, Chongde Rd, Beitun District, Taichung City",
      website: "Facebook Page ",
      note: "Call before going & Provide service for dogs, cats, rodents, and rabbits ",
      phone: "04-2241-2700",
      lat: 24.175348,
      lng: 120.6859193,
    },
    {
      name: "Muen Animal Hospital",
      address: "No. 865, Jianxing Rd, North District, Taichung City, 404",
      website: "Facebook Page ",
      note: "Call before going & Sunday Off",
      phone: "04-2207-7271",
      lat: 24.159047,
      lng: 120.6694723,
    },
    {
      name: "Loving Kindness Animal Hospital(Taichung Main branch)",
      address: "No. 539, Sec. 2, Guoguang Rd., Dali Dist., Taichung City",
      website: "Facebook Page ",
      note: "",
      phone: "04-2406-6688",
      lat: 24.1117741,
      lng: 120.6788988,
    },
    {
      name: "Chung Ai Veterinary Hospital",
      address:
        "No. 490, Section 2, Zhongshan Rd, Yuanlin City, Changhua County",
      website: "https://www.chungai.com.tw/main/View_Service.aspx ",
      note: "Call before going",
      phone: "04-833-5520",
      lat: 23.9714398,
      lng: 120.5714543,
    },
    {
      name: "Ho Mu Animal Hospital",
      address: "No. 454, Guangfu Rd, Huwei Township, Yunlin County",
      website: "Facebook Page ",
      note: "Call before going & Sunday Off",
      phone: "05-633-0811",
      lat: 23.7109443,
      lng: 120.4344367,
    },
    {
      name: "National Veterinary Hospital(Tainan Branch)",
      address: "2F., No. 620, Chongde Rd., East Dist., Tainan City",
      website: "https://www.vet.com.tw/en/about.php ",
      note: "",
      phone: "06-267-3191",
      lat: 22.9706936,
      lng: 120.2273543,
    },
    {
      name: "Noah Animal Hospital",
      address: "No. 297, Chenggong Rd, West Central District, Tainan City",
      website: "http://www.ky-animal.com.tw/ ",
      note: "Call before going & Sunday Off",
      phone: "06-221-7291",
      lat: 22.9995962,
      lng: 120.2009944,
    },
    {
      name: "Loving Kindness Animal Hospital(Tainan Branch)",
      address: "No. 437, Sec. 1, Ximen Rd., South Dist., Tainan City",
      website: "https://www.lkah.com.tw ",
      note: "",
      phone: "06-220-3166",
      lat: 22.9808672,
      lng: 120.1974267,
    },
    {
      name: "Alliance Veterinary Hospital(Renwu Main Branch)",
      address: "No. 231, Fengren Rd., Renwu Dist., Kaohsiung City",
      website: "https://www.pet100pa.com/vet ",
      note: "Emergency service from 9PM to 2AM & Provide service for dogs, cats, rodents, rabbits, hedgehogs, sugar gliders, birds, parrots and reptiles ",
      phone: "07-374-0964 #20",
      lat: 22.6979774,
      lng: 120.3469705,
    },
    {
      name: "Hung Li Animal Hospital",
      address: "No. 326, Mingcheng 1st Rd, Sanmin District, Kaohsiung City",
      website: "https://www.hunglivet.com/ ",
      note: "",
      phone: "07-310-2819",
      lat: 22.659977,
      lng: 120.324799,
    },
    {
      name: "Jong-Shing Animal Hospital",
      address: "No. 498, Wenfu Rd, Zuoying District, Kaohsiung City",
      website: "http://www.jsah.com.tw/ ",
      note: "Provide emergency service from 9:30PM to 2AM ",
      phone: "07-350-2020#431",
      lat: 22.6913366,
      lng: 120.3167105,
    },
    {
      name: "Udoch Animal Hospital",
      address: "No. 139, Zhongzheng 1st Rd, Lingya District, Kaohsiung City",
      website: "https://udochah.wixsite.com/udoch ",
      note: "Press the emergency bell at the door if service needed",
      phone: "07-722-0804",
      lat: 22.628337,
      lng: 120.330864,
    },
    {
      name: "GuanAn Animal Hospital",
      address: "No. 131-1, Zhongzheng 2nd Rd, Lingya District, Kaohsiung City",
      website: "",
      note: "Call after 9:30PM, Sunday after 5:30PM",
      phone: "07-223-6451",
      lat: 22.630227,
      lng: 120.315545,
    },
    {
      name: "Hope Veterinary Hospital",
      address: "No. 100, Kaixuan Rd, Fengshan District, Kaohsiung City",
      website: "Facebook Page ",
      note: "Call before going",
      phone: "07-753-7300",
      lat: 22.6074945,
      lng: 120.3588147,
    },
    {
      name: "MingRen Veterinary Hospital",
      address: "No. 7, Ren'ai Rd, Pingtung City, Pingtung County",
      website: "Facebook Page ",
      note: "Call before going",
      phone: "08-751-2022",
      lat: 22.6680245,
      lng: 120.4910189,
    },
    {
      name: "Shanghai Animal Hospital",
      address: "No. 63, Shanghai St, Hualien City, Hualien County",
      website: "",
      note: "Call before going",
      phone: "03-834-1853",
      lat: 23.9729448,
      lng: 121.6021628,
    },
  ];
  // console.log(markers); //--> Get undefined(SOLVED)

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
            `<strong>Clinic name: ${m["name"]}</strong><br>Address: ${
              m["address"]
            }
            <br><strong>Note: ${
              m["note"] || "none"
            }</strong><br>Phone Number: <a href="${m["phone"].replaceAll(
              "-",
              ""
            )}">${
              m["phone"]
            }</a><br><a href="https://www.google.com/maps/dir/?api=1&destination=${
              m["lat"]
            },${m["lng"]}&travelmode=driving" target="blank">Get Direction</a>`
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
