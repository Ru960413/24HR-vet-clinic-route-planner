# interact with Google Map API: 利用Geocoding API和Distance Matrix API  

import json
import requests
import csv

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



# DONE read vet clinic address and save its latitude and longitude into csv
# read address from csv files(row[1])
addresses = []

# loop through all the address and call getLatLng(address)
with open("csv/details-zh-updated.csv") as file:
    reader = csv.reader(file)
    for row in reader:
        addresses.append({"name": row[0],"address": row[1], "note": row[2], "phone": row[3], "lanLng": getLatLng(row[1])})
print(addresses)

# Reference: https://stackoverflow.com/questions/3086973/how-do-i-convert-this-list-of-dictionaries-to-a-csv-file

# save the outputs and add it to a new csv
keys = addresses[0].keys()

with open('csv/new_details_zh.csv', 'w', newline='') as output_file:
    dict_writer = csv.DictWriter(output_file, fieldnames = keys)
    dict_writer.writeheader()
    dict_writer.writerows(addresses)

