import mysql.connector
import login_helper as login

def collect(file_types): 
	"""
	Requires: a sequence of file types (in strings) whose numbers of downloads 
	we want to count.

	Effects: Grabs the download numbers of specified file types from the mysql database. 
	Returns a sequence of integers. 
	"""
	DATABASE = login.getCredentials('sql-database', 'database')
	HOST = login.getCredentials('sql-database', 'host')
	USERNAME = login.getCredentials('sql-database', 'username')
	PASSWORD = login.getCredentials('sql-database', 'password')
	counts = []
	months = []
	conn = mysql.connector.connect(database = DATABASE, host = HOST, user = USERNAME, password = PASSWORD)
	cur = conn.cursor();

	curmonth_query = "SELECT CURDATE()"
	cur.execute(curmonth_query)
	curmonth = str(cur.fetchone()[0])[:7]
	months.insert(0, curmonth)

	# Get the range of months that we want data for
	month = curmonth
	for i in range(12): 
		if month[-2:] != "01" and int(month[-2:]) < 10:
			month = month[:-1] + str(int(month[-2:]) - 1) 
		elif month[-2:] == "01": 
			month = str(int(month[:4]) - 1) + "-12"
		elif int(month[-2:]) == 10: 
			month = month[:-2] + "0" + str(int(month[-2:]) - 1)
		else: 
			month = month[:-2] + str(int(month[-2:]) - 1)
		months.insert(0, month)
	# print(months)

	# Execute queries of counting specific file types' downloads
	query = "SELECT COUNT(*) FROM `pis_downloads` WHERE SUBSTRING(`file`, -3, 3) = '%s' AND SUBSTRING(`date`, 1, 7) = SUBSTRING('%s', 1, 7)"
	for month in months: 
		counts_month = []
		for file_type in file_types: 
			cur.execute(query % (file_type, month))
			counts_month.append(cur.fetchone()[0])
		counts.append(counts_month)

	conn.close()

	return counts

# test = ['mp4', 'pdf']
# print(collect(test))
	
def divideData(data):
	mp4 = []
	pdf = []
	for item in data:
		mp4.append(item[0])
		pdf.append(item[1])
	return mp4, pdf

	