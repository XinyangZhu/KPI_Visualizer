import gspread
from oauth2client.service_account import ServiceAccountCredentials
import login_helper as login

service = login.gspread_auth()
spreadsheet_id = login.getCredentials("google-sheet","id")
spreadsheet = service.spreadsheets().values()

def add_new_row(dataArray,sheetName,Range):
	row_range = sheetName+"!"+Range
	input_option = 'RAW'
	insert_option = 'INSERT_ROWS'
	data_value=[dataArray]
	data_body = {
		'values':data_value
	}
	request = spreadsheet.append(
		spreadsheetId=spreadsheet_id,
		range=Range,
		valueInputOption=input_option,
		insertDataOption=insert_option,
		body=data_body)
	return request

"""
Code for Google spreadsheet API
"""

scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
credentials = ServiceAccountCredentials.from_json_keyfile_name('Kpi_Visualizer-ad10458012e8.json', scope)
gc = gspread.authorize(credentials)
wk = gc.open('Automated KPI sheet').worksheet('pistacja')

# credentials2 = ServiceAccountCredentials.from_json_keyfile_name('Kpi Visualizer-ef4886fc63bc.json', scope)
# gc2 = gspread.authorize(credentials2)
# wk2 = gc.open("Katalyst Education projects main online KPI's").sheet1
# print(wk2.row_values(5)[-13:])

def update_column(dataArray, cellRange):
	"""
	dataArray and cellRange must be of the same length
	"""
	cell_list = wk.range(cellRange)

	for i in range(0, len(dataArray)):
		cell_list[i].value = dataArray[i]
	
	wk.update_cells(cell_list)


def get_col_data(colIdx):
	return wk.col_values(colIdx)

def get_cell(cellPosition):
	return wk.acell(cellPosition).value




