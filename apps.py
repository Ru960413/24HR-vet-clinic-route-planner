# interact with Google Map API: 利用Geocoding API和Distance Matrix API  

import json
import requests

# url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=Seattle&destinations=San+Francisco&key=AIzaSyDGIhVa1IgIS69H7oOjC5l4nog_ZY5L1_c"
# r = requests.get(url)
# print(r.json())

Google_API_KEY = "AIzaSyDGIhVa1IgIS69H7oOjC5l4nog_ZY5L1_c"

def getRoute():
    API_KEY = Google_API_KEY
    url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial"

    clinic = input("Enter a vet clinic address\n")

    home = input("Enter a home address\n")

    # get response
    r = requests.get(url + "origins="+ home + "&destinations=" + clinic + "&key=" + API_KEY)

    # return time as text
    # time = r.json()["rows"][0]["elements"][0]["duration"]["text"]
    # seconds = r.json()["rows"][0]["elements"][0]["duration"]["value"]

    # print("\nTHe total travel time from hom to vet clinic is", time)

# No. 74, Yumen Rd, Xitun District, Taichung City, Taiwan
# No. 30, Yuandong St, Longjing District, Taichung City, Taiwan
# getRoute()

def getLatLng(address):
    lat, lng = None, None
    api_key = Google_API_KEY
    url = "https://maps.googleapis.com/maps/api/geocode/json"
    endPoint = f"{url}?address={address}&key={api_key}&language=zh-TW"

    r = requests.get(endPoint)
    if r.status_code not in range(200, 299):
        return None, None
    else:
        try:
            results = r.json()['results'][0]
            lat = results['geometry']['location']['lat']
            lng = results['geometry']['location']['lng']
        
        except:
            pass

        return lat, lng



# TODO: read vet clinic address and save its latitude and longitude into csv
# read address from csv files(row[1])

# loop through all the address and call getLatLng(address)
file = open("templates/details-en.csv", "a")

# save the outputs and add it as row[4] using append mode

# repeat it for the chinese csv
