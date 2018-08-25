import datetime
from datetime import date
import calendar


"""
Code for getting the a list of the past 'monthSub' dates in the 'yyyy-mm' format.
"""

def findPast12Month(monthSub):
    today = str(date.today())[0: -3]
    monthCurr = int(datetime.datetime.now().month)
    yearCurr = int(datetime.datetime.now().year)
    date_list = [today]

    for i in range(0, monthSub):
        monthPrev = monthCurr - 1

        if (monthPrev <= 0):
            monthPrev = 12
            yearCurr = yearCurr - 1

        if (int(monthPrev) < 10):
            monthPrev = '0' + str(monthPrev)

        datePrev = str(yearCurr) + '-' + str(monthPrev)
        date_list.insert(0, datePrev)
        monthCurr = int(monthPrev)

    # print (date_list)
    return date_list

# print(findPast12Month(12))

"""
Code for getting the date for the first day(yyyy-mm-dd) of a month that is 'monthSub' months ago.
"""

def setStartDate(monthSub):
	currentMonth = datetime.datetime.now().month
	currentYear = datetime.datetime.now().year
	monthPrev = currentMonth - monthSub
	yearPrev = currentYear


	if ((currentMonth - monthSub) > 0):
		monthPrev = currentMonth - monthSub
	else:
		while (monthPrev <= 0):
			yearPrev -= 1
			monthPrev += 12
			currentMonth += 12
		monthPrev = currentMonth - monthSub
	# print(monthPrev)
	# print(yearPrev)
	if monthPrev < 10:
		return str(yearPrev) + "-0" + str(monthPrev) + '-01'
	else:
		return str(yearPrev) + '-' + str(monthPrev) + '-01'

# print (setStartDate(12))


"""
Code for getting the first day of next month.
"""

def setEndDate1():
	year = datetime.datetime.now().year
	month = datetime.datetime.now().month

	yearNext = year
	if (month == 12):
		monthNext = 1
		yearNext = year + 1
	else:
		monthNext = month + 1

	if (int(monthNext) < 10):
		monthNext = '0' + str(monthNext)

	return (str(yearNext) + '-' + str(monthNext) + '-01')


# print(setEndDate1())



"""
Code for getting the last day for this month.
"""

def setEndDate2():
	year = datetime.datetime.now().year
	month = datetime.datetime.now().month
	day = datetime.datetime.now().day

	next_month = datetime.date(year, month, day).replace(day=28) + datetime.timedelta(days=4)

	return next_month - datetime.timedelta(days=next_month.day)

# print (setEndDate2())	



"""
Code for getting date ranges for google analytics(v4)
Format: [{'startDate': '2017-07-01', 'endDate': '2017-07-31'}, {}, {}.....]
"""

def dateRange():
	startDate = []
	endDate = []
	dateRanges = []
	dates = findPast12Month(12)

	for i in range(0, len(dates)):
		startDate.append(dates[i] + '-01')
		year = startDate[i][0:4]
		month = startDate[i][5:7]
		# print (month)
		if (month == '01' or month == '03' or month == '05' or month == '07' or month == '08' or month == '10' or month == '12'):
			endDate.append(year + '-' + month + '-31')
		elif (month == '04' or month == '06' or month == '09' or month == '11'):
			endDate.append(year + '-' + month + '-30')
		elif (int(year) % 4 == 0):
			endDate.append(year + '-' + month + '-29')
		else:
			endDate.append(year + '-' + month + '-28')
		dateRanges.append({'startDate': startDate[i], 'endDate': endDate[i]})
	

	return dateRanges
# print (dateRange())
# dateRange()



