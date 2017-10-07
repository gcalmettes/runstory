import glob
import json


if __name__ == '__main__':

	files = glob.glob("formattedData/*.json")
	
	dataArray = []
	
	for filename in files:
	    with open(filename) as data_file:
	        activityFile = json.load(data_file)
	        try:
	            activity = {"date": activityFile["date"],
	                "id": activityFile["id"],
	                "activityType": activityFile["activityType"],
	                "name": activityFile["name"],
	                "durationMin": activityFile["durationMin"],
	                "distanceKm": activityFile["distanceKm"],
	                "elevationUpM": activityFile["elevationUpM"],
	                "elevationDownM": activityFile["elevationDownM"]
	                       }
	        except:
	            activity = None
	            print("activity skipped")
	        
	        if activity is not None:
	            dataArray.append(activity)
	        
	        data_file.close()
	            
	            
	allActivities = {"allActivities": dataArray}
	
	
	with open("stravaAll.json", 'w') as outfile:
	    json.dump(allActivities, outfile)
	    outfile.close()