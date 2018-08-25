import os
import google.oauth2.credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


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
Helper functions for 
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
    monthlyData[month]['desktop'] = data[0]
    monthlyData[month]['tv'] = data[1]
    monthlyData[month]['mobile'] = data[2]
    monthlyData[month]['tablet'] = data[3]
    monthlyData[month]['others'] = data[4]

    result.append(monthlyData)

  # print (result)
  return result



def main(startD, endD):
  youtubeAnalytics = get_service()

  deviceTypeData = execute_api_request(
                        youtubeAnalytics.reports().query,
                        ids='channel==MINE',
                        dimensions='day,deviceType',
                        startDate=startD,
                        endDate=endD,
                        metrics='views',
                        sort='day'
                   )
  return computeMonthlyViewsByDeviceType(deviceTypeData)


# main('2017-06-01', '2018-06-30')


