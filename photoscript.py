import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
import os
import csv

dictionary = {}

cloudinary.config(cloud_name = 'dukemarket316', api_key="234625649551842", api_secret = "r0fmaoEFlTSdqrw9t7vjj4H0z_0")

directory = os.path.abspath(os.getcwd()) +"/images"

for folder in os.listdir(directory):
    newlist = []
    foldername = "marketplace316/"+folder+"/"
    if os.path.isdir(os.path.join(directory,folder)):
        for filename in os.listdir(os.path.join(directory,folder)):
            name = os.path.join(os.path.join(directory, folder),filename)
            if(filename.endswith(".jpg") or filename.endswith(".png")):
                response = cloudinary.uploader.upload(name, folder= foldername)
                newlist.append(response['secure_url'])
                # newlist.append(filename)
        dictionary[folder] = newlist

print(dictionary)
w = csv.writer(open("output.csv", "w"))
for key, val in dictionary.items():
    w.writerow([key, val])

