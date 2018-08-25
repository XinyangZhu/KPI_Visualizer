import urllib
# from urlparse import urlparse
import requests
import login_helper as login_helper
from collections import OrderedDict

def login():
	username = login_helper.getCredentials('jira','username')
	password = login_helper.getCredentials("jira","password")
	return (username,password)

def search(jql):
	base_url = "https://jira.katalysteducation.org/rest/api/2/search?jql="
	url = base_url+jql
	res = requests.get(url,auth=login())
	return res.json()

def jql(type_,status):
	query_details = 'type='+type_+'&status '+status
	return urllib.quote(query_details)

# Create queries in JIRA
def nMonthBack(n): 
	return " AFTER startOfMonth(-" + str(n) + ") BEFORE endOfMonth(-" + str(n) + ")"

def total_published_video(n):
	return search(jql('Video','was DONE' + nMonthBack(n)))['total']

def total_published_playlist(n):
	return search(jql('Playlist','was DONE' + nMonthBack(n)))['total']

def total_pipeline_video(n):
	return search(jql('Video','was not DONE' + nMonthBack(n)))['total']

def total_preproduction_video(n):
	return search(jql('Video','was Pre-Production' + nMonthBack(n)))['total']

def total_production_video(n):
	return search(jql('Video','was Production' + nMonthBack(n)))['total']

def total_postproduction_video(n):
	return search(jql('Video','was not in (Open,Pre-Production,Production,Publication,"Quality Control 2","Quality Control 1","Final Approval","Final Approval 2",Planning,"Teaser Approval",DONE)' + nMonthBack(n)))['total']

def cnx_graphics(n):
	return search(jql('"CNX Subtask"','was not in (Open,"CNX Ingest","Quality Control 1",Editing)' + nMonthBack(n)))['total']

def cnx_modules(n):
	return search(jql('"CNX Section"','was not in (Open,"Adaptation (Stage I)","Legitimization (Stage II)",Editing,"CNX Ingest")' + nMonthBack(n)))['total']

def get_jira_data():
	data = OrderedDict()
	data['published videos'] = []
	data['published playlists'] = []
	data['pipeline videos'] = []
	data['postproduction videos'] = []
	data['preproduction videos'] = []
	data['production videos'] = []
	data['cnx graphics'] = []
	data['cnx modules'] = []
	for n in range(13): 
		n = 12- n
		data['published videos'].append(total_published_video(n))
		data['published playlists'].append(total_published_playlist(n))
		data['pipeline videos'].append(total_pipeline_video(n))
		data['postproduction videos'].append(total_postproduction_video(n))
		data['preproduction videos'].append(total_preproduction_video(n))
		data['production videos'].append(total_production_video(n))
		data['cnx graphics'].append(cnx_graphics(n))
		data['cnx modules'].append(cnx_modules(n))
	return data
	
	
# print(get_jira_data())