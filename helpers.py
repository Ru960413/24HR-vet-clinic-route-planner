import requests
import csv
from flask import jsonify
import json

Google_API_KEY = "AIzaSyDGIhVa1IgIS69H7oOjC5l4nog_ZY5L1_c"

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
  
    json.dump(addresses_zh, out_file, indent = 6)
  
    out_file.close()

    # data = jsonify(addresses_zh)    

    # return data



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

    # return jsonify(addresses_en)
    # return json.dumps(addresses_en)

# get_addresses_en()