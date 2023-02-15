# creates json files for Front End access

import requests
import csv
import json
import os
from dotenv import load_dotenv

load_dotenv()

# get google map API Key from environment variable
Google_API_KEY = os.getenv('Google_API_KEY')


def getLatLng(address):
    lat, lng = None, None
    url = "https://maps.googleapis.com/maps/api/geocode/json"
    endPoint = f"{url}?address={address}&key={Google_API_KEY}&language=zh-TW"

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


# # DONE read vet clinic address and save its latitude and longitude into csv
# # read address from csv files(row[1])
# addresses = []

# # loop through all the address and call getLatLng(address)
# with open("csv/details-zh-updated.csv") as file:
#     reader = csv.reader(file)
#     for row in reader:
#         addresses.append({"name": row[0],"address": row[1], "note": row[2], "phone": row[3], "lanLng": getLatLng(row[1])})
# print(addresses)

# # Reference: https://stackoverflow.com/questions/3086973/how-do-i-convert-this-list-of-dictionaries-to-a-csv-file

# # save the outputs and add it to a new csv
# keys = addresses[0].keys()

# with open('csv/new_details_zh.csv', 'w', newline='') as output_file:
#     dict_writer = csv.DictWriter(output_file, fieldnames = keys)
#     dict_writer.writeheader()
#     dict_writer.writerows(addresses)

def get_addresses_zh():
    # read address from csv files(row[1])
    addresses_zh = []

    # loop through all the address and call getLatLng(address)
    with open("csv/details-zh-updated.csv") as file:
        reader = csv.reader(file)
        # skip the first row(header row) 
        next(reader)

        for row in reader:
            addresses_zh.append({"name": row[0],"address": row[1], "website": row[2], "note": row[3], "phone": row[4], "lat": getLatLng(row[1])[0], "lng": getLatLng(row[1])[1]})
    # print(addresses_zh)
    out_file = open("info_zh.json", "w")

    # add in ensure_ascii=False so that chinese data can be displayed correctly in JSON file
    json.dump(addresses_zh, out_file, indent = 6, ensure_ascii=False)
  
    out_file.close()



def get_addresses_en():
    # read address from csv files(row[1])
    addresses_en = []

    # loop through all the address and call getLatLng(address)
    with open("csv/details-en-updated.csv") as file:
        reader = csv.reader(file)
        # skip the first row(header row) 
        next(reader)
        for row in reader:
            addresses_en.append({"name": row[0],"address": row[1], "website": row[2], "note": row[3], "phone": row[4], "lat": getLatLng(row[1])[0], "lng": getLatLng(row[1])[1]})
    
    # which one is better for this situation save data in another file or pass it as a variable?
    out_file = open("info_en.json", "w")
  
    json.dump(addresses_en, out_file, indent = 6)
  
    out_file.close()

# get_addresses_en()
# get_addresses_zh()