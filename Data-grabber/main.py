# import youtube_deviceType as youtubeD
# import gspread
# from oauth2client.service_account import ServiceAccountCredentials
import json
from datetime import datetime
from threading import Timer

import login_helper as login
import gsheethelper as gsheet
import youtube_test as youtubeM
import youtube_cumulative as youtubeC
import set_date as date
import sql_grabber as sql
import googleAnalytics as ga
import jira
import facebook_grabber as facebook



def main():
    # Update dates
    date_list = date.findPast12Month(12)
    gsheet.update_column(date_list, 'A5:A17')

    # Update Pi-Stacja Youtube data
    youtube_data = youtubeM.main(date.setStartDate(12), date.setEndDate1(), date.setEndDate2())

    youtube_data1 = youtube_data[0]
    youtube_data2 = youtube_data[1]

    youtube_subscriber_M = []
    youtube_views_M = []
    youtube_comments_M = []
    youtube_likes_M = []

    youtube_tv = []
    youtube_mobile = []
    youtube_others = []
    youtube_tablet = []
    youtube_desktop = []

    for i in range(0,len(youtube_data1)):
        youtube_subscriber_M.append(youtube_data1[i].values()[0]['subscribers'])
        youtube_views_M.append(youtube_data1[i].values()[0]['views'])
        youtube_comments_M.append(youtube_data1[i].values()[0]['comments'])
        youtube_likes_M.append(youtube_data1[i].values()[0]['likes'])

        youtube_tv.append(youtube_data2[i].values()[0]['tv'])
        youtube_mobile.append(youtube_data2[i].values()[0]['mobile'])
        youtube_others.append(youtube_data2[i].values()[0]['others'])
        youtube_tablet.append(youtube_data2[i].values()[0]['tablet'])
        youtube_desktop.append(youtube_data2[i].values()[0]['desktop'])
    
    if len(youtube_subscriber_M) < 13:
        youtube_subscriber_M.append(str(0))
    if len(youtube_views_M) < 13:
        youtube_views_M.append(str(0))
    if len(youtube_comments_M) < 13:
        youtube_comments_M.append(str(0))
    if len(youtube_likes_M) < 13:
        youtube_likes_M.append(str(0))

    gsheet.update_column(youtube_subscriber_M, 'B5:B17')
    gsheet.update_column(youtube_views_M, 'D5:D17')
    gsheet.update_column(youtube_comments_M, 'H5:H17')
    gsheet.update_column(youtube_likes_M, 'I5:I17')

    gsheet.update_column(youtube_tv, 'M5:M17')
    gsheet.update_column(youtube_mobile, 'K5:K17')
    gsheet.update_column(youtube_others, 'N5:N17')
    gsheet.update_column(youtube_tablet, 'L5:L17')
    gsheet.update_column(youtube_desktop, 'J5:J17')

    youtube_subscriber_C = youtubeC.youtubeCumulativeData('subscriberCount', 12, 2)
    gsheet.update_column(youtube_subscriber_C, 'C5:C17')
    youtube_views_C = youtubeC.youtubeCumulativeData('viewCount', 12, 4)
    gsheet.update_column(youtube_views_C, 'E5:E17')
    youtube_videosPublished_C = youtubeC.youtubeVideosPublished()[0]
    gsheet.update_column(youtube_videosPublished_C, 'G5:G17')
    youtube_videosPublished_M = youtubeC.youtubeVideosPublished()[1]
    gsheet.update_column(youtube_videosPublished_M, 'F5:F17')

    # Update Pi-Stacja MP4 and PDF downloads data
    sql_data = sql.collect(['mp4', 'pdf'])
    # sql_data = [[28, 52], [35, 72], [213, 159], [499, 415], [270, 375], [187, 189], [552, 604], [193, 253], [456, 365], [521, 496], [293, 322], [203, 155], [0, 0]]
    mp4 = sql.divideData(sql_data)[0]
    pdf = sql.divideData(sql_data)[1]
    gsheet.update_column(mp4, 'AA5:AA17')
    gsheet.update_column(pdf, 'AB5:AB17')

    # Update GoogleAnalytics data
    pistacja_sessions = ga.get_session_user('pi-stacja')[0]
    pistacja_users = ga.get_session_user('pi-stacja')[1]
    gsheet.update_column(pistacja_sessions, 'Y5:Y17')
    gsheet.update_column(pistacja_users, 'Z5:Z17')

    KE_sessions = ga.get_session_user('katalyst-education')[0]
    KE_users = ga.get_session_user('katalyst-education')[1]
    gsheet.update_column(KE_sessions, 'AC5:AC17')
    gsheet.update_column(KE_users, 'AD5:AD17')

    CM_sessions = ga.get_session_user('career-map')[0]
    CM_users = ga.get_session_user('career-map')[1]
    gsheet.update_column(CM_sessions, 'AE5:AE17')
    gsheet.update_column(CM_users, 'AF5:AF17')

    # Update Jira data
    jira_data = jira.get_jira_data()
    gsheet.update_column(jira_data['published videos'], 'Q5:Q17')
    gsheet.update_column(jira_data['published playlists'], 'R5:R17')
    gsheet.update_column(jira_data['pipeline videos'], 'S5:S17')
    gsheet.update_column(jira_data['postproduction videos'], 'T5:T17')
    gsheet.update_column(jira_data['preproduction videos'], 'U5:U17')
    gsheet.update_column(jira_data['production videos'], 'V5:V17')
    gsheet.update_column(jira_data['cnx graphics'], 'W5:W17')
    gsheet.update_column(jira_data['cnx modules'], 'X5:X17')

    # Update Facebook data
    pis_fb_data = facebook.get_pis()
    cm_fb_data = facebook.get_cm()
    gsheet.update_column(pis_fb_data[0], 'O17:O17')
    gsheet.update_column(pis_fb_data[1], 'P17:P17')
    gsheet.update_column(cm_fb_data[0], 'AG17:AG17')
    gsheet.update_column(cm_fb_data[1], 'AH17:AH17')

    return

if __name__ == "__main__":
    # main()
    x = datetime.today()
    y = x.replace(day=x.day + 1, hour=9, minute=0, second=0, microsecond=0)
    delta_t = y - x

    secs = delta_t.seconds + 1
    t = Timer(secs, main)
    t.start()

