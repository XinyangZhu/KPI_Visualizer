import os
import google.oauth2.credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from datetime import date
import datetime


from oauth2client.client import OAuth2WebServerFlow
from oauth2client.tools import run_flow
from oauth2client.file import Storage



SCOPES = ['https://www.googleapis.com/auth/youtube.readonly']

API_SERVICE_NAME = 'youtubeAnalytics'
API_VERSION = 'v2'
CLIENT_SECRETS_FILE = 'client_secret.json'



"""
Code for youtube API
"""

def get_service():
  flow = OAuth2WebServerFlow(client_id="360037614152-8g8nu6mp0p1ij4qm5qk35bfn276eqrjn.apps.googleusercontent.com",
                             client_secret="uAGesT32sBdUGNOBh106K00l",
                             scope=SCOPES)

  storage = Storage('creds.data')

  credentials = run_flow(flow, storage)

  return build(API_SERVICE_NAME, API_VERSION, credentials=credentials)


def execute_api_request(client_library_function, **kwargs):
  response = client_library_function(
    **kwargs
  ).execute()

  rows = response["rows"]
  # print (response["rows"])
  return rows




"""
Helper functions for getting the monthly data(subscribers, views, number of likes and comments).
"""

def monthlyData(monthlyData):
  month = monthlyData[0]

  data = {month: {}}
  data[month]["views"] = monthlyData[1]
  data[month]["likes"] = monthlyData[2]
  data[month]["subscribers"] = monthlyData[3]
  data[month]["comments"] = monthlyData[4]
  data[month]["videosPublished"] = monthlyData[5]
  # print data
  return data




def groupDataByMonth(data):
  result = []
  for item in data:
    result.append(monthlyData(item))
  # print (result)
  return result





"""
Helper functions for getting the monthly data grouped by deviceType
"""


def computeTotalViewsByDeviceType(rows):
  desktop = 0
  tv = 0
  mobile = 0
  tablet = 0
  others = 0
  for item in rows:
    if item[1] == 'DESKTOP':
      desktop += item[2]
    elif item[1] == 'TV':
      tv += item[2]
    elif item[1] == 'MOBILE':
      mobile += item[2]
    elif item[1] == 'TABLET':
      tablet += item[2]
    else:
      others += item[2]
  return desktop, tv, mobile, tablet, others




def devideByMonth(response):
  result = []

  for i in range(1, len(response)):
    month1 = response[i - 1][0]
    month2 = response[i][0]

    if (month1[5: -3] != month2[5: -3]):
      monthlyData = []
      monthlyData.append(response[i])
      result.append(monthlyData)
    else:
      monthlyData.append(response[i])

  return result





def computeMonthlyViewsByDeviceType(response):
  response.insert(0, ['yyyy-mm-dd', 'deviceType', -1])
  res = devideByMonth(response)

  result = []
  for item in res:
    month = item[0][0][0: -3]
    monthlyData = {month: {'desktop': 0, 'tv': 0, 'mobile': 0, 'tablet': 0, "others": 0}}
    data = computeTotalViewsByDeviceType(item)
    total = sum(data)

    monthlyData[month]['desktop'] = '{0:.2%}'.format((data[0] / float(total)))
    monthlyData[month]['tv'] = '{0:.2%}'.format((data[1] / float(total)))
    monthlyData[month]['mobile'] = '{0:.2%}'.format((data[2] / float(total)))
    monthlyData[month]['tablet'] = '{0:.2%}'.format((data[3] / float(total)))
    monthlyData[month]['others'] = '{0:.2%}'.format((data[4] / float(total)))

    result.append(monthlyData)

  # print (result)
  return result



"""
Main function 
"""

def main(start1, end1, end2):
  youtubeAnalytics = get_service()
  response = execute_api_request(
                  youtubeAnalytics.reports().query,
                  ids='channel==MINE',
                  dimensions='month',
                  startDate=start1,
                  endDate=end1,
                  metrics='views,likes,subscribersGained,comments,videosAddedToPlaylists'
             )

  deviceTypeData = execute_api_request(
                        youtubeAnalytics.reports().query,
                        ids='channel==MINE',
                        dimensions='day,deviceType',
                        startDate=start1,
                        endDate=end2,
                        metrics='views',
                        sort='day'
                   )
# computeMonthlyViewsByDeviceType(deviceTypeData)
  return groupDataByMonth(response), computeMonthlyViewsByDeviceType(deviceTypeData)


# main('2017-06-01', '2018-07-01', '2018-06-30')

