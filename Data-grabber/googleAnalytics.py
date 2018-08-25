import httplib2
from apiclient.discovery import build
from oauth2client.client import flow_from_clientsecrets
from oauth2client.file import Storage
from oauth2client import tools
import argparse

import login_helper as login
import set_date as date


"""
Code for Google Analytics v3
"""

CLIENT_SECRETS = 'client_secrets.json'
 
# The Flow object to be used if we need to authenticate.
FLOW = flow_from_clientsecrets(
    CLIENT_SECRETS,
    scope='https://www.googleapis.com/auth/analytics.readonly',
    message='%s is missing' % CLIENT_SECRETS
    )
 
# A file to store the access token
TOKEN_FILE_NAME = 'credentials.dat'
 


"""
Code for preparing credentials and initializing service(return a google analytics service object)
"""

def prepare_credentials():
    parser = argparse.ArgumentParser(parents=[tools.argparser])
    flags = parser.parse_args()
    # Retrieve existing credendials
    storage = Storage(TOKEN_FILE_NAME)
    credentials = storage.get()
    # If no credentials exist, we create new ones
    if credentials is None or credentials.invalid:
        credentials = tools.run_flow(FLOW, storage, flags)
    return credentials
 
 
def initialize_service():
    # Creates an http object and authorize it using
    # the function prepare_creadentials()
    http = httplib2.Http()
    credentials = prepare_credentials()
    http = credentials.authorize(http)
    # Build the Analytics Service Object with the authorized http object
    return build('analytics', 'v3', http=http)
 


"""
Code for data query.
"""

def get_data(viewId, dateRange):
    service = initialize_service()
    viewId = 'ga:' + viewId

    data = service.data().ga().get(
                  ids=viewId, 
                  start_date=dateRange['startDate'], 
                  end_date=dateRange['endDate'], 
                  metrics='ga:sessions,ga:users'
           ).execute()

    return data.get('rows', [])[0]



"""
Return a list of sessions data and a list of users data for the past 13 months.
"""

def get_session_user(pageName):
    viewId = login.getCredentials('google-analytics',pageName)
    dateRanges = date.dateRange()
    sessions = []
    users = []

    for item in dateRanges:
        data = get_data(viewId, item)
        sessions.append(data[0])
        users.append(data[1])
    return sessions, users  




# print (get_data('133181834', {'startDate': '2018-07-01', 'endDate': '2018-07-31'}))
# print (get_data_set('katalyst-education'))
# print (get_report('channel==MINE','2018-07-01',endDate='2018-07-01'))
# print (get_session_user('katalyst-education'))
# print (date.dateRange()[-2:])
# print (get_report('118319780'))
# print (get_data('177495530'))
# print (get_user('katalyst-education'))