# interact with Google Map API: 利用Geocoding API和Distance Matrix API  

import json
import requests

# url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=Seattle&destinations=San+Francisco&key=AIzaSyDGIhVa1IgIS69H7oOjC5l4nog_ZY5L1_c"
# r = requests.get(url)
# print(r.json())

API_KEY = "AIzaSyDGIhVa1IgIS69H7oOjC5l4nog_ZY5L1_c"

def getRoute():
    API_KEY = "AIzaSyDGIhVa1IgIS69H7oOjC5l4nog_ZY5L1_c"
    url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial"

    clinic = input("Enter a vet clinic address\n")

    home = input("Enter a home address\n")

    # get response
    r = requests.get(url + "origins="+ home + "&destinations=" + clinic + "&key=" + API_KEY)

    print(r.json())

    # return time as text
    # time = r.json()["rows"][0]["elements"][0]["duration"]["text"]
    # seconds = r.json()["rows"][0]["elements"][0]["duration"]["value"]

    # print("\nTHe total travel time from hom to vet clinic is", time)

# No. 74, Yumen Rd, Xitun District, Taichung City, Taiwan
# No. 30, Yuandong St, Longjing District, Taichung City, Taiwan
# getRoute()



