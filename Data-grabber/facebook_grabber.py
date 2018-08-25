# import requests
# import json
# import facebook
import login_helper as login
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# driver = webdriver.PhantomJS('/Users/zhuxinyang/Downloads/phantomjs-2.1.1-macosx/bin/phantomjs')

USERNAME = login.getCredentials('facebook', 'ke-username')
PASSWORD = login.getCredentials('facebook', 'ke-password')
CHROME_ADDR = '/Users/zhuxinyang/Downloads/chromedriver'

def get_pis(): 
	"""
	GET function for Pi-Stacja data: number of followers and likes. 
	Return an array of two integers. 
	"""
	# Use the selenium webdriver API
	driver = webdriver.Chrome(CHROME_ADDR)

	# Get number of followers
	driver.get('https://www.facebook.com/PistacjaMatematyka/insights/?section=navFollowers')
	# Login
	email_element = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.ID, "email")))
	email_element.send_keys(USERNAME)
	pass_element = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.ID, "pass")))
	pass_element.send_keys(PASSWORD)
	button_element = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.ID, "loginbutton")))
	button_element.click()

	followers_element = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.CLASS_NAME, "_5ejd")))
	pis_followers = int(followers_element.text.split()[-1])

	# Get number of likes
	driver.get('https://www.facebook.com/PistacjaMatematyka/insights/?section=navLikes')
	likes_element = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.CLASS_NAME, "_5ejd")))
	pis_likes = int(likes_element.text.split()[-1])
	driver.close()
	return [pis_followers, pis_likes]

def get_cm(): 
	"""
	GET function for Career Map data: number of followers and likes. 
	Return an array of two integers. 
	"""
	# Use the selenium webdriver API
	driver = webdriver.Chrome(CHROME_ADDR)

	# Get number of followers
	driver.get('https://www.facebook.com/MapaKarier/insights/?section=navFollowers')
	# Login
	email_element = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.ID, "email")))
	email_element.send_keys(USERNAME)
	pass_element = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.ID, "pass")))
	pass_element.send_keys(PASSWORD)
	button_element = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.ID, "loginbutton")))
	button_element.click()

	followers_element = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.CLASS_NAME, "_5ejd")))
	cm_followers = int(followers_element.text.split()[-1])

	# Get number of likes
	driver.get('https://www.facebook.com/MapaKarier/insights/?section=navLikes')
	likes_element = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.CLASS_NAME, "_5ejd")))
	cm_likes = int(likes_element.text.split()[-1])
	driver.close()
	return [cm_followers, cm_likes]


# def get_likes(): 
# 	driver = webdriver.Chrome('/Users/zhuxinyang/Downloads/chromedriver')

# 	driver.get('https://www.facebook.com/PistacjaMatematyka/')
# 	# driver.save_screenshot('pistacja_facebook_screenshot.png')
# 	# p_element = driver.find_element_by_id("PagesLikesCountDOMID")
# 	p_element = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.ID, "PagesLikesCountDOMID")))
# 	pistacja_likes = int(p_element.text.split()[0].replace(",", ""))
# 	# driver.close()

# 	driver.get('https://www.facebook.com/MapaKarier/')
# 	p_element = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.ID, "PagesLikesCountDOMID")))
# 	# p_element2 = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.CLASS_NAME, "_4bl9")))
# 	cm_likes = int(p_element.text.split()[0].replace(",", ""))
# 	# print(p_element2.text)
# 	# ele = p_element2.find_element_by_tag_name('div')
# 	# print(ele)
# 	# cm_followers = ele.text
# 	driver.close()

# 	return [pistacja_likes, cm_likes]

