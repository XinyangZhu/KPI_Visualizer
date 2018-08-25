import copy
# import gspread
# from oauth2client.service_account import ServiceAccountCredentials

import youtube_grabber as youtube
import gsheethelper as gsheet
from datetime import date
import datetime

# scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
# credentials = ServiceAccountCredentials.from_json_keyfile_name('Kpi Visualizer-ef4886fc63bc.json', scope)
# gc = gspread.authorize(credentials)
# wk = gc.open("Katalyst Education projects main online KPI's").sheet1
# print(wk.row_values(1)[-13:])


# subscribersGlobal = []
# subscribersGlobal = copy.deepcopy(gsheet.get_col_data(3))
# print (subscribersGlobal)
# subscribersGlobal = copy.deepcopy(wk.row_values(2))
# subscribersGlobal = copy.deepcopy(wk.row_values(5))
# gsheet.update_column(subscribersGlobal[-13:], 'G5:G17')


"""
Code for getting the cumulative subscribers, views.
"""

def youtubeCumulativeData(param, monthSub, colIdx):
	monthlyData = gsheet.get_col_data(colIdx)
	monthlyData = monthlyData[4:17]
	# monthlyData = monthlyData[-(monthSub + 1):]
	monthlyData = monthlyData[4: 17]

	YOUTUBE_RAW_DATA = youtube.request_stats()
	currentData = youtube.get_statistics(YOUTUBE_RAW_DATA, param)

	cumulativeData = [currentData]

	for i in range(len(monthlyData) - 1, -1, -1):
		newData = int(cumulativeData[0]) - int(monthlyData[i])
		cumulativeData.insert(0, str(newData))
	# print (cumulativeData[-(monthSub + 1):])	
	return cumulativeData[-(monthSub + 1):]


"""
Code for getting the monthly number of videos published.
"""

def youtubeVideosPublished():
	month = gsheet.get_cell('A17')[5:]
	if (int(datetime.datetime.now().month) < 10):
		monthCurr = '0' + str(datetime.datetime.now().month)
	else:
		monthCurr = str(datetime.datetime.now().month)

	YOUTUBE_RAW_DATA = youtube.request_stats()
	cumulativeVideosPublished = gsheet.get_col_data(7)[-13:]

	if (monthCurr == month):
		newData = youtube.get_statistics(YOUTUBE_RAW_DATA, 'videoCount')
		cumulativeVideosPublished[-1] = newData
		monthlyVideosPublishedFirst = gsheet.get_col_data(6)[4]
	else:
		cumulativeVideosPublished.append(newData)
		cumulativeVideosPublished = cumulativeVideosPublished[-13:]
		monthlyVideosPublishedFirst = gsheet.get_col_data(6)[5]

	
	monthlyVideosPublished = [monthlyVideosPublishedFirst]

	for i in range(0, len(cumulativeVideosPublished) - 1):
		newData = int(cumulativeVideosPublished[i + 1]) - int(cumulativeVideosPublished[i])
		monthlyVideosPublished.append(str(newData))
	
	return cumulativeVideosPublished, monthlyVideosPublished
	# videosPublished = gsheet.get_col_data(6)
	# newData = int(gsheet.get_col_data(7)[-1]) - int(gsheet.get_col_data(7)[-2])
	# 	
	# 	videosPublished[-1] = newData
	# else:
	# 	videosPublished.append(newData)
	# return videosPublished[-13:]




# youtubeVideosPublished()
# youtubeCumulativeSubscribers(12)
# youtubeMonthlyVideosPublished()
# youtubeCumulativeData('subscriberCount', 12, 2)


