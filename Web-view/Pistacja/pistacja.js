var header = document.getElementsByClassName('header')[0];
var numberButton = document.getElementById('numberButton');
var chartButton = document.getElementById('chartButton');
var slideShowNumber = document.getElementsByClassName('slideShow')[0];
var slideShowChart = document.getElementsByClassName('slideShow')[1];
var dataTables = document.querySelectorAll('table');
var charts = document.getElementsByClassName('chart');
var startPauseBody = document.getElementById('startPauseBody');
var startPauseButton = document.getElementById('startPauseButton');
var dots = document.getElementsByClassName('dot');
var youtubeDropdown = document.getElementById('youtube-dropdown');
var youtubeNoDropdown = document.getElementById('youtube-no-dropdown');
var slideShowState = true;
var monthNames = {"01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun",
"07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"};



$(document).ready(function() {
	setTimeout(function(){
		$('body').addClass('loaded');
    $('body').removeClass('preloaded');
	}, 1000);
	$('.subscribers').delay(1400).animate({'top': '32%'}, 700);
	// countNumber(2800, cumulativeSubscribersData[cumulativeSubscribersData.length - 1]['value'], '#subscriberNum');
	// $('.buttons').delay(1400).animate({'top': '32%', 'opacity': 1}, 700);

});
//



// If numberButton is selected:
numberButton.addEventListener('click', function() {
	header.parentNode.removeChild(header);

  // if (! window.navigator.onLine && localStorage.getItem("pistacja_data") != null) {
  //   document.getElementById('datatime').innerHTML = "Using data from " + JSON.parse(localStorage.getItem("date"))[0].substring(0, 10);
  //   document.getElementById('datatime').style.display = 'block';
  // } else {
  //   document.getElementById('datatime').style.display = 'none';
  // }
  slideShowNumber.style.display = 'block';
  slideShowChart.style.display = 'none';
  numberButton.style.display = 'none';
  chartButton.style.display = 'none';
  youtubeDropdown.style.display = 'block';
  youtubeNoDropdown.style.display = 'none';
});


// If chartButton is selected:
chartButton.addEventListener('click', function() {
	header.parentNode.removeChild(header);

  // if (! window.navigator.onLine && localStorage.getItem("pistacja_data") != null) {
  //   document.getElementById('datatime').innerHTML = "Using data from " + JSON.parse(localStorage.getItem("date"))[0].substring(0, 10);
  //   document.getElementById('datatime').style.display = 'block';
  // } else {
  //   document.getElementById('datatime').style.display = 'none';
  // }
  slideShowNumber.style.display = 'none';
  slideShowChart.style.display = 'block';
  numberButton.style.display = 'none';
  chartButton.style.display = 'none';
  startPauseBody.style.display = 'block';
  youtubeDropdown.style.display = 'block';
  youtubeNoDropdown.style.display = 'none';

  slideShowState = true;
});



// Click Start/Pause Button to start or pause the slide show.
startPauseButton.addEventListener('click', function(e) {
	startPauseBody.classList.toggle('toggle-body--on');
	startPauseButton.classList.toggle('toggle-btn--on');
	startPauseButton.classList.toggle('toggle-btn--scale');
  if (slideShowState) {
    slideShowState = false;
  } else {
    slideShowState = true;
    automaticSlideShowChart();
  }
});





// Youtube Selection => Number / Chart:
function youtubeSelection(choice) {
  if (choice == 'number') {
    slideShowNumber.style.display = 'block';
    slideShowChart.style.display = 'none';
    startPauseBody.style.display = 'none';
  }
  else {
    slideShowChart.style.display = 'block';
    slideShowNumber.style.display = 'none';
    startPauseBody.style.display = 'block';
    slideShowState = true;
  }
}



// Load data from google spreadsheet.
var parsedData = [];
var monthlySubscribersData = [];
var cumulativeSubscribersData = [];
var monthlyViewsData = [];
var cumulativeViewsData = [];
var monthlyVideosPublishedData = [];
var cumulativeVideosPublishedData = [];
var commentsAndLikesData = [
  {
    seriesname: 'Comments',
    data: []
  },
  {
    seriesname: 'Number of Likes',
    data: []
  }
];
var commentsAndLikesCategory = [];
var averageDeviceTypePercentage = [
  {
    label: 'Desktop',
    displayValue: '',
    value: ''
  },
  {
    label: 'Mobile',
    displayValue: '',
    value: ''
  },
  {
    label: 'Tablet',
    displayValue: '',
    value: ''
  },
  {
    label: 'TV',
    displayValue: '',
    value: ''
  },
  {
    label: 'Others',
    displayValue: '',
    value: ''
  }
];

var averageViews = 0;
var desktop = 0;
var mobile = 0;
var tablet = 0;
var tv = 0;
var others = 0;

var mp4PDFDownloadData = [
  {
    seriesname: 'MP4 Downloads',
    data: []
  },
  {
    seriesname: 'PDF Downloads',
    data: []
  }
];
var mp4PDFDownloadCategory = [];

var pistacjaSessionUserData = [
  {
    seriesname: 'Pistacja Sessions',
    data: []
  },
  {
    seriesname: 'Pistacja Users',
    data: []
  }
];
var pistacjaSessionUserCategory = [];


var spreadsheet = '19KvaY04qRaUYvk_rPWC5qHUgzdwr06Eq4b37VGuHjgY';
var url = 'https://spreadsheets.google.com/feeds/list/' + spreadsheet + '/od6/public/basic?alt=json';

// localStorage.removeItem("pistacja_data");
// localStorage.removeItem("date");

if (! window.navigator.onLine) {
  if (localStorage.getItem("pistacja_data") == null) {
    alert("Requires Internet connection.");
  } else {
    // alert("You're offline. Using data from " + JSON.parse(localStorage.getItem("date"))[0].substring(0, 19).replace("T", " ") + " (UTC).");
    parsedData = JSON.parse(localStorage.getItem("pistacja_data"));

    // Assign different types of data to different arrays for the purpose of making the charts.
		var thisyear = false;
		var labelColor = "";
		var yearstart = false;
    for (var i = 0; i < parsedData.length; i++) {
			if (!thisyear) {
				if (parsedData[i]['label'].substring(5) == "01" && i > 0) {
					thisyear = true;
					labelColor = "#1354b9";
				} else {
					labelColor = "#4e5867";
				}
			}
			if (parsedData[i]['label'].substring(5) == "01" || i == 0) {
				yearstart = true;
			} else {
				yearstart = false;
			}
      var values = parsedData[i]['value'];
      for (var j = 0; j < values.length; j++) {
        values[j] = values[j].substring(values[j].indexOf(":") + 1);
      }
      monthlySubscribersData.push({
				label: yearstart
          ? monthNames[parsedData[i]['label'].substring(5)] + "\n" + parsedData[i]['label'].substring(0, 4)
          : monthNames[parsedData[i]['label'].substring(5)],
        value: parsedData[i]['value'][0].substring(1),
        labelFontColor: labelColor,
        labelFontSize: "12px"
      });

      cumulativeSubscribersData.push({
				label: yearstart
          ? monthNames[parsedData[i]['label'].substring(5)] + "\n" + parsedData[i]['label'].substring(0, 4)
          : monthNames[parsedData[i]['label'].substring(5)],
        value: parsedData[i]['value'][1],
        labelFontColor: labelColor,
        labelFontSize: "12px"
      });
      monthlyViewsData.push({
				label: yearstart
          ? monthNames[parsedData[i]['label'].substring(5)] + "\n" + parsedData[i]['label'].substring(0, 4)
          : monthNames[parsedData[i]['label'].substring(5)],
        value: parsedData[i]['value'][2],
        labelFontColor: labelColor,
        labelFontSize: "12px"
      });
      cumulativeViewsData.push({
				label: yearstart
          ? monthNames[parsedData[i]['label'].substring(5)] + "\n" + parsedData[i]['label'].substring(0, 4)
          : monthNames[parsedData[i]['label'].substring(5)],
        value: parsedData[i]['value'][3],
        labelFontColor: labelColor,
        labelFontSize: "12px"
      });
      monthlyVideosPublishedData.push({
				label: yearstart
          ? monthNames[parsedData[i]['label'].substring(5)] + "\n" + parsedData[i]['label'].substring(0, 4)
          : monthNames[parsedData[i]['label'].substring(5)],
        value: parsedData[i]['value'][4],
        labelFontColor: labelColor,
        labelFontSize: "12px"
      });
      cumulativeVideosPublishedData.push({
				label: yearstart
          ? monthNames[parsedData[i]['label'].substring(5)] + "\n" + parsedData[i]['label'].substring(0, 4)
          : monthNames[parsedData[i]['label'].substring(5)],
        value: parsedData[i]['value'][5],
        labelFontColor: labelColor,
        labelFontSize: "12px"
      });
      commentsAndLikesData[0]['data'].push({
        value: parsedData[i]['value'][6]
      });
      commentsAndLikesData[1]['data'].push({
        value: parsedData[i]['value'][7]
      });
      commentsAndLikesCategory.push({
				label: yearstart
          ? monthNames[parsedData[i]['label'].substring(5)] + "\n" + parsedData[i]['label'].substring(0, 4)
          : monthNames[parsedData[i]['label'].substring(5)],
        labelFontColor: labelColor,
        labelFontSize: "12px"
      });
      mp4PDFDownloadData[0]['data'].push({
        value: parsedData[i]['value'][25]
      });
      mp4PDFDownloadData[1]['data'].push({
        value: parsedData[i]['value'][26]
      });
      mp4PDFDownloadCategory.push({
				label: yearstart
          ? monthNames[parsedData[i]['label'].substring(5)] + "\n" + parsedData[i]['label'].substring(0, 4)
          : monthNames[parsedData[i]['label'].substring(5)],
        labelFontColor: labelColor,
        labelFontSize: "12px"
      });
      pistacjaSessionUserData[0]['data'].push({
        value: parsedData[i]['value'][23]
      });
      pistacjaSessionUserData[1]['data'].push({
        value: parsedData[i]['value'][24]
      });
      pistacjaSessionUserCategory.push({
				label: yearstart
          ? monthNames[parsedData[i]['label'].substring(5)] + "\n" + parsedData[i]['label'].substring(0, 4)
          : monthNames[parsedData[i]['label'].substring(5)],
        labelFontColor: labelColor,
        labelFontSize: "12px"
      });


      averageViews += Number(parsedData[i]['value'][2]);
      desktop += parseFloat(parsedData[i]['value'][8]);
      mobile += parseFloat(parsedData[i]['value'][9]);
      tablet += parseFloat(parsedData[i]['value'][10]);
      tv += parseFloat(parsedData[i]['value'][11]);
      others += parseFloat(parsedData[i]['value'][12]);
    }


    // Device Type Data from percentage to real number.
    averageViews = averageViews / 13;
    averageDeviceTypePercentage[0]['value'] = String((desktop / 1300) * averageViews);
    averageDeviceTypePercentage[0]['displayValue'] = String((desktop/13).toFixed(2)) + '%';

    averageDeviceTypePercentage[1]['value'] = String(mobile / 1300 * averageViews);
    averageDeviceTypePercentage[1]['displayValue'] = String((mobile/13).toFixed(2)) + '%';

    averageDeviceTypePercentage[2]['value'] = String(tablet / 1300 * averageViews);
    averageDeviceTypePercentage[2]['displayValue'] = String((tablet/13).toFixed(2)) + '%';

    averageDeviceTypePercentage[3]['value'] = String(tv / 1300 * averageViews);
    averageDeviceTypePercentage[3]['displayValue'] = String((tv/13).toFixed(2)) + '%';

    averageDeviceTypePercentage[4]['value'] = String(others / 1300 * averageViews);
    averageDeviceTypePercentage[4]['displayValue'] = String((others/13).toFixed(2)) + '%';


    countNumber(2000, cumulativeSubscribersData[cumulativeSubscribersData.length - 1]['value'], '#subscriberNum');
    countNumber(4000, cumulativeViewsData[cumulativeViewsData.length - 1]['value'], '#viewNum');
    countNumber(6000, cumulativeVideosPublishedData[cumulativeVideosPublishedData.length - 1]['value'], '#videoNum');
    $('#updateTime').text("Last updated(UTC): " + JSON.parse(localStorage.getItem("date"))[0].substring(0, 19).replace("T", " "));

    // Update table1:
    var tr1 = document.querySelectorAll('#table1 tr');
    for (var i = 1; i < tr1.length; i++) {
      var td1 = tr1[i].querySelectorAll('td');
			td1[0].innerHTML = (i == 1 || parsedData[i - 1]['label'].substring(5) == "01")
        ? parsedData[i - 1]['label'].substring(0, 5) + monthNames[parsedData[i - 1]['label'].substring(5)]
        : monthNames[parsedData[i - 1]['label'].substring(5)];
      for (var j = 1; j < td1.length; j++) {
        td1[j].innerHTML = parsedData[i - 1]['value'][j - 1];
      }
    }

    // Update table2:
    var tr2 = document.querySelectorAll('#table2 tr');
    for (var i = 1; i < tr2.length; i++) {
      var td2 = tr2[i].querySelectorAll('td');
			td2[0].innerHTML = (i == 1 || parsedData[i - 1]['label'].substring(5) == "01")
        ? parsedData[i - 1]['label'].substring(0, 5) + monthNames[parsedData[i - 1]['label'].substring(5)]
        : monthNames[parsedData[i - 1]['label'].substring(5)];
      for (var j = 1; j < td2.length; j++) {
        td2[j].innerHTML = parsedData[i - 1]['value'][j - 1 + 6];
      }
    }


    // Update table3:
    var tr3 = document.querySelectorAll('#table3 tr');
    for (var i = 1; i < tr3.length; i++) {
      var td3 = tr3[i].querySelectorAll('td');
			td3[0].innerHTML = (i == 1 || parsedData[i - 1]['label'].substring(5) == "01")
        ? parsedData[i - 1]['label'].substring(0, 5) + monthNames[parsedData[i - 1]['label'].substring(5)]
        : monthNames[parsedData[i - 1]['label'].substring(5)];
      for (var j = 1; j < td3.length; j++) {
        td3[j].innerHTML = parsedData[i - 1]['value'][j - 1 + 8];
      }
    }

    // Update table4:
    var tr4 = document.querySelectorAll('#table4 tr');
    for (var i = 1; i < tr4.length; i++) {
      var td4 = tr4[i].querySelectorAll('td');
			td4[0].innerHTML = (i == 1 || parsedData[i - 1]['label'].substring(5) == "01")
        ? parsedData[i - 1]['label'].substring(0, 5) + monthNames[parsedData[i - 1]['label'].substring(5)]
        : monthNames[parsedData[i - 1]['label'].substring(5)];
      for (var j = 1; j < td4.length; j++) {
        td4[j].innerHTML = parsedData[i - 1]['value'][j - 1 + 25];
      }
    }

    // Update table5:
    var tr5 = document.querySelectorAll('#table5 tr');
    for (var i = 1; i < tr5.length; i++) {
      var td5 = tr5[i].querySelectorAll('td');
			td5[0].innerHTML = (i == 1 || parsedData[i - 1]['label'].substring(5) == "01")
        ? parsedData[i - 1]['label'].substring(0, 5) + monthNames[parsedData[i - 1]['label'].substring(5)]
        : monthNames[parsedData[i - 1]['label'].substring(5)];
      for (var j = 1; j < td5.length; j++) {
        td5[j].innerHTML = parsedData[i - 1]['value'][j - 1 + 23];
      }
    }

    // Update table5:
    var tr6 = document.querySelectorAll('#table6 tr');
    for (var i = 1; i < tr6.length; i++) {
      var td6 = tr6[i].querySelectorAll('td');
			td6[0].innerHTML = (i == 1 || parsedData[i - 1]['label'].substring(5) == "01")
        ? parsedData[i - 1]['label'].substring(0, 5) + monthNames[parsedData[i - 1]['label'].substring(5)]
        : monthNames[parsedData[i - 1]['label'].substring(5)];
      for (var j = 1; j < td6.length; j++) {
        td6[j].innerHTML = parsedData[i - 1]['value'][j - 1 + 15];
      }
    }

    // Update table7:
    var tr7 = document.querySelectorAll('#table7 tr');
    for (var i = 1; i < tr7.length; i++) {
      var td7 = tr7[i].querySelectorAll('td');
			td7[0].innerHTML = (i == 1 || parsedData[i - 1]['label'].substring(5) == "01")
        ? parsedData[i - 1]['label'].substring(0, 5) + monthNames[parsedData[i - 1]['label'].substring(5)]
        : monthNames[parsedData[i - 1]['label'].substring(5)];
      for (var j = 1; j < td7.length; j++) {
        td7[j].innerHTML = parsedData[i - 1]['value'][j - 1 + 21];
      }
    }

    // Monthly Subscribers Bar Plot:
    new FusionCharts({
      type: 'column2d',
      renderAt: 'monthlySubscribers',
      width: '95%',
      height: '500',
      dataFormat: 'json',
      dataSource: {
        "chart": {
          'caption': 'Youtube Monthly Subscribers',
          'captionFontSize': '20',
          'xAxisName': '{br} Date',
          'xAxisNameFontSize': '15',
          'yAxisName': 'Youtube Subscribers(Monthly)',
          'yAxisNameFontSize': '15',
          'formatNumberScale': '0',
          'paletteColors': '#66b3ff',
          'bgColor': '#ffffff',
          'borderAlpha': '0',
          'canvasBorderAlpha': '0',
          'usePlotGradientColor': '0',
          'plotBorderAlpha': '0',
          'plotBorderColor': '#ffffff',
          'placevaluesInside': '0',
          'valueFontColor': '#6666ff',
          'valueFontSize': '12',
          'valueFontBold': '0.7',
          'valueFontAlpha': '50',
          'divlineColor': '#999999',
          'divlineIsDashed': '1',
          'showAlternateHGridColor': '0',
          'toolTipBgColor': 'transparent',
          'toolTipPadding': '12',
          'toolTipBorderColor': '#0080ff',
          'toolTipBorderRadius': '3',
          'toolTipBorderThickness': '1',
          'plotToolText': '<div style="font-size: 14px; color: #0080ff">$label: $value</div>'
        },
        "data": monthlySubscribersData
      }
    }).render();


    // Cumulative Subscribers Bar Plot:
    new FusionCharts({
      type: 'column2d',
      renderAt: 'cumulativeSubscribers',
      width: '95%',
      height: '500',
      dataFormat: 'json',
      dataSource: {
        "chart": {
          'caption': 'Youtube Cumulative Subscribers',
          'captionFontSize': '20',
          'xAxisName': '{br} Date',
          'xAxisNameFontSize': '15',
          'yAxisName': 'Youtube Subscribers(Cumulative)',
          'yAxisNameFontSize': '15',
          'formatNumberScale': '0',
          'paletteColors': '#ff9999',
          'bgColor': '#ffffff',
          'borderAlpha': '0',
          'canvasBorderAlpha': '0',
          'usePlotGradientColor': '0',
          'plotBorderAlpha': '0',
          'plotBorderColor': '#ffffff',
          'placevaluesInside': '0',
          'valueFontColor': '#ff4d4d',
          'valueFontSize': '12',
          'valueFontBold': '0.7',
          'valueFontAlpha': '50',
          'divlineColor': '#999999',
          'divlineIsDashed': '1',
          'showAlternateHGridColor': '0',
          'toolTipBgColor': 'transparent',
          'toolTipPadding': '12',
          'toolTipBorderColor': '#ff3333',
          'toolTipBorderRadius': '3',
          'toolTipBorderThickness': '1',
          'plotToolText': '<div style="font-size: 14px; color: #ff3333">$label: $value</div>'
        },
        "data": cumulativeSubscribersData
      }
    }).render();

    // Monthly Views Bar Plot:
    new FusionCharts({
      type: 'column2d',
      renderAt: 'monthlyViews',
      width: '95%',
      height: '500',
      dataFormat: 'json',
      dataSource: {
        "chart": {
          'caption': 'Youtube Monthly Views',
          'captionFontSize': '20',
          'xAxisName': '{br} Date',
          'xAxisNameFontSize': '15',
          'yAxisName': 'Youtube Views(Monthly)',
          'yAxisNameFontSize': '15',
          'formatNumberScale': '0',
          'paletteColors': '#bfff00',
          'bgColor': '#ffffff',
          'borderAlpha': '0',
          'canvasBorderAlpha': '0',
          'usePlotGradientColor': '0',
          'plotBorderAlpha': '0',
          'plotBorderColor': '#ffffff',
          'placevaluesInside': '0',
          'valueFontColor': '#80ff00',
          'valueFontSize': '12',
          'valueFontBold': '0.7',
          'valueFontAlpha': '50',
          'divlineColor': '#999999',
          'divlineIsDashed': '1',
          'showAlternateHGridColor': '0',
          'toolTipBgColor': 'transparent',
          'toolTipPadding': '12',
          'toolTipBorderColor': '#00ff00',
          'toolTipBorderRadius': '3',
          'toolTipBorderThickness': '1',
          'plotToolText': '<div style="font-size: 14px; color: #00ff00">$label: $value</div>'
        },
        "data": monthlyViewsData
      }
    }).render();

    // Cumulative Views Bar Plot:
    new FusionCharts({
      type: 'column2d',
      renderAt: 'cumulativeViews',
      width: '95%',
      height: '500',
      dataFormat: 'json',
      dataSource: {
        "chart": {
          'caption': 'Youtube Cumulative Views',
          'captionFontSize': '20',
          'xAxisName': '{br} Date',
          'xAxisNameFontSize': '15',
          'yAxisName': 'Youtube Views(Cumulative)',
          'yAxisNameFontSize': '15',
          'formatNumberScale': '0',
          'paletteColors': '#ffbf00',
          'bgColor': '#ffffff',
          'borderAlpha': '0',
          'canvasBorderAlpha': '0',
          'usePlotGradientColor': '0',
          'plotBorderAlpha': '0',
          'plotBorderColor': '#ffffff',
          'placevaluesInside': '0',
          'valueFontColor': '#ff9966',
          'valueFontSize': '12',
          'valueFontBold': '0.7',
          'valueFontAlpha': '50',
          'divlineColor': '#999999',
          'divlineIsDashed': '1',
          'showAlternateHGridColor': '0',
          'toolTipBgColor': 'transparent',
          'toolTipPadding': '12',
          'toolTipBorderColor': '#ff8c66',
          'toolTipBorderRadius': '3',
          'toolTipBorderThickness': '1',
          'plotToolText': '<div style="font-size: 14px; color: #ff8c66">$label: $value</div>'
        },
        "data": cumulativeViewsData
      }
    }).render();

    // Monthly Videos Published Bar Plot:
    new FusionCharts({
      type: 'column2d',
      renderAt: 'monthlyVideosPublished',
      width: '95%',
      height: '500',
      dataFormat: 'json',
      dataSource: {
        "chart": {
          'caption': 'Youtube Monthly Videos Published',
          'captionFontSize': '20',
          'xAxisName': '{br} Date',
          'xAxisNameFontSize': '15',
          'yAxisName': 'Youtube Videos Published(Monthly)',
          'yAxisNameFontSize': '15',
          'formatNumberScale': '0',
          'paletteColors': '#b3b3ff',
          'bgColor': '#ffffff',
          'borderAlpha': '0',
          'canvasBorderAlpha': '0',
          'usePlotGradientColor': '0',
          'plotBorderAlpha': '0',
          'plotBorderColor': '#ffffff',
          'placevaluesInside': '0',
          'valueFontColor': '#6666ff',
          'valueFontSize': '12',
          'valueFontBold': '0.7',
          'valueFontAlpha': '50',
          'divlineColor': '#999999',
          'divlineIsDashed': '1',
          'showAlternateHGridColor': '0',
          'toolTipBgColor': 'transparent',
          'toolTipPadding': '12',
          'toolTipBorderColor': '#9966ff',
          'toolTipBorderRadius': '3',
          'toolTipBorderThickness': '1',
          'plotToolText': '<div style="font-size: 14px; color: #9966ff">$label: $value</div>'
        },
        "data": monthlyVideosPublishedData
      }
    }).render();

    // Cumulative Videos Published Bar Plot:
    new FusionCharts({
      type: 'column2d',
      renderAt: 'cumulativeVideosPublished',
      width: '95%',
      height: '500',
      dataFormat: 'json',
      dataSource: {
        "chart": {
          'caption': 'Youtube Cumulative Videos Published',
          'captionFontSize': '20',
          'xAxisName': '{br} Date',
          'xAxisNameFontSize': '15',
          'yAxisName': 'Youtube Videos Published(Cumulative)',
          'yAxisNameFontSize': '15',
          'formatNumberScale': '0',
          'paletteColors': '#ff99cc',
          'bgColor': '#ffffff',
          'borderAlpha': '0',
          'canvasBorderAlpha': '0',
          'usePlotGradientColor': '0',
          'plotBorderAlpha': '0',
          'plotBorderColor': '#ffffff',
          'placevaluesInside': '0',
          'valueFontColor': '#ff4da6',
          'valueFontSize': '12',
          'valueFontBold': '0.7',
          'valueFontAlpha': '50',
          'divlineColor': '#999999',
          'divlineIsDashed': '1',
          'showAlternateHGridColor': '0',
          'toolTipBgColor': 'transparent',
          'toolTipPadding': '12',
          'toolTipBorderColor': '#ff4d88',
          'toolTipBorderRadius': '3',
          'toolTipBorderThickness': '1',
          'plotToolText': '<div style="font-size: 14px; color: #ff4d88">$label: $value</div>'
        },
        "data": cumulativeVideosPublishedData
      }
    }).render();

    // Comments and Number of Likes:
    new FusionCharts({
      type: 'MSColumn2D',
      renderAt: 'commentsAndLikes',
      width: '95%',
      height: '500',
      dataFormat: 'json',
      dataSource: {
        "chart": {
          'caption': 'Youtube Monthly Comments and Number of Likes',
          'captionFontSize': '20',
          'xAxisName': '{br} Date',
          'xAxisNameFontSize': '15',
          'yAxisName': 'Number of Comments and Likes',
          'yAxisNameFontSize': '15',
          'formatNumberScale': '0',
          'paletteColors': '#ff9999, #66ccff',
          'bgColor': '#ffffff',
          'borderAlpha': '0',
          'canvasBorderAlpha': '0',
          'usePlotGradientColor': '0',
          'plotBorderAlpha': '0',
          'plotBorderColor': '#ffffff',
          'placevaluesInside': '0',
          'valueFontColor': '#bf80ff',
          'valueFontSize': '12',
          'valueFontBold': '0.7',
          'valueFontAlpha': '50',
          'divlineColor': '#999999',
          'divlineIsDashed': '1',
          'showAlternateHGridColor': '0',
          'showHoverEffect': '1',
          'showToolTip': '1',
          'toolTipBgColor': 'transparent',
          'toolTipPadding': '12',
          'toolTipBorderColor': '#7300e6',
          'toolTipBorderRadius': '3',
          'toolTipBorderThickness': '1',
          'plotToolText': '<div style="font-size: 14px; color: #7300e6">$label $seriesname: $value</div>',
          'legendBgAlpha': '0',
          'legendBorderAlpha': '0',
          'legendShadow': '0',
          'legendItemFontSize': '15',
          'legendItemFontColor': '#666666',
          'showHoverEffect': '1'
        },
        "categories": [{
          'category': commentsAndLikesCategory
        }],
        "dataset": commentsAndLikesData
      }
    }).render();

    // Average Views grouped by Device type
    new FusionCharts({
      type: 'pie2d',
      renderAt: 'averageDeviceTypePercentage',
      width: '95%',
      height: '500',
      dataFormat: 'json',
      dataSource: {
        "chart": {
          'caption': 'Average Views Grouped by Device Type',
          'captionFontSize': '20',
          'paletteColors': '#233D4D, #FE7F2D, #FCCA46, #A1C181, #579C87',
          'bgColor': '#ffffff',
          'showBorder': '0',
          'use3DLighting': '0',
          'showShadow': '0',
          'enableSmartLabels': '1',
          'startingAngle': '0',
          'showPercentValues': '1',
          'showPercentInTooltip': '1',
          'decimals': '1',
          'toolTipColor': '#7575a3',
          'toolTipBorderThickness': '1',
          'toolTipBorderRadius': '3',
          'toolTipBorderColor': '#7575a3',
          'toolTipBgColor': 'transparent',
          'toolTipPadding': '12',
          'plotToolText': '<div style="font-size: 14px; font-weight: bold">$label: $displayValue</div>',
          'showHoverEffect': '1',
          'showLegend': '1',
          'labelFontColor': '#7e8589',
          'labelFontSize': '13',
          'labelFontBold': '1',
          'legendBorderAlpha': '0',
          'legendItemFontSize': '13'
        },
        "data": averageDeviceTypePercentage
      }
    }).render();

    // Pistacja MP4 & PDF Downloads
    new FusionCharts({
      type: 'MSColumn2D',
      renderAt: 'mp4AndPdfDownloads',
      width: '95%',
      height: '500',
      dataFormat: 'json',
      dataSource: {
        "chart": {
          'caption': 'Pistacja monthly MP4 and PDF Downloads',
          'captionFontSize': '20',
          'xAxisName': '{br} Date',
          'xAxisNameFontSize': '15',
          'yAxisName': 'Number of MP4 and PDF Downloads',
          'yAxisNameFontSize': '15',
          'formatNumberScale': '0',
          'paletteColors': '#68bcec, #ff80bf',
          'bgColor': '#ffffff',
          'borderAlpha': '0',
          'canvasBorderAlpha': '0',
          'usePlotGradientColor': '0',
          'plotBorderAlpha': '0',
          'plotBorderColor': '#ffffff',
          'placevaluesInside': '0',
          'valueFontColor': '#8080ff',
          'valueFontSize': '12',
          'valueFontBold': '0.7',
          'valueFontAlpha': '50',
          'divlineColor': '#999999',
          'divlineIsDashed': '1',
          'showAlternateHGridColor': '0',
          'showHoverEffect': '1',
          'showToolTip': '1',
          'toolTipBgColor': 'transparent',
          'toolTipPadding': '12',
          'toolTipBorderColor': '#3333cc',
          'toolTipBorderRadius': '3',
          'toolTipBorderThickness': '1',
          'plotToolText': '<div style="font-size: 14px; color: #3333cc">$label $seriesname: $value</div>',
          'legendBgAlpha': '0',
          'legendBorderAlpha': '0',
          'legendShadow': '0',
          'legendItemFontSize': '15',
          'legendItemFontColor': '#666666',
          'showHoverEffect': '1'
        },
        "categories": [{
          'category': mp4PDFDownloadCategory
        }],
        "dataset": mp4PDFDownloadData
      }
    }).render();


    // Pistacja Sessions & Users Downloads
    new FusionCharts({
      type: 'MSColumn2D',
      renderAt: 'pistacjaSessionUser',
      width: '95%',
      height: '500',
      dataFormat: 'json',
      dataSource: {
        "chart": {
          'caption': 'Pistacja monthly Sessions and Users',
          'captionFontSize': '20',
          'xAxisName': '{br} Date',
          'xAxisNameFontSize': '15',
          'yAxisName': 'Number of Sessions and Users',
          'yAxisNameFontSize': '15',
          'formatNumberScale': '0',
          'paletteColors': '#8383e2, #9be283',
          'bgColor': '#ffffff',
          'borderAlpha': '0',
          'canvasBorderAlpha': '0',
          'usePlotGradientColor': '0',
          'plotBorderAlpha': '0',
          'plotBorderColor': '#ffffff',
          'placevaluesInside': '0',
          'valueFontColor': '#b383e2',
          'valueFontSize': '12',
          'valueFontBold': '0.7',
          'valueFontAlpha': '50',
          'divlineColor': '#999999',
          'divlineIsDashed': '1',
          'showAlternateHGridColor': '0',
          'showHoverEffect': '1',
          'showToolTip': '1',
          'toolTipBgColor': 'transparent',
          'toolTipPadding': '12',
          'toolTipBorderColor': '#6666ff',
          'toolTipBorderRadius': '3',
          'toolTipBorderThickness': '1',
          'plotToolText': '<div style="font-size: 14px; color: #6666ff">$label $seriesname: $value</div>',
          'legendBgAlpha': '0',
          'legendBorderAlpha': '0',
          'legendShadow': '0',
          'legendItemFontSize': '15',
          'legendItemFontColor': '#666666',
          'showHoverEffect': '1'
        },
        "categories": [{
          'category': pistacjaSessionUserCategory
        }],
        "dataset": pistacjaSessionUserData
      }
    }).render();
  }
} else {
  // alert("Online.");
  $.getJSON({
    url: url,
    success: function(response) {
      var data = response.feed.entry;
      // console.log(data);
      // parsedData is a list of objects which contains all the data imported from spreadsheet
      for (var i = 3; i < data.length; i++) {
        parsedData.push({
          label: data[i].title.$t,
          value: data[i].content.$t.split(', ')
        });
      }

      // console.log(parsedData);

      localStorage.setItem("pistacja_data", JSON.stringify(parsedData));
      var curdate = new Date();
      localStorage.setItem("date", JSON.stringify([curdate]));

      // Assign different types of data to different arrays for the purpose of making the charts.
			var thisyear = false;
			var labelColor = "";
			var yearstart = false;
      for (var i = 0; i < parsedData.length; i++) {
				if (!thisyear) {
          if (parsedData[i]['label'].substring(5) == "01" && i > 0) {
            thisyear = true;
            labelColor = "#1354b9";
          } else {
            labelColor = "#4e5867";
          }
        }
        if (parsedData[i]['label'].substring(5) == "01" || i == 0) {
          yearstart = true;
        } else {
          yearstart = false;
        }

        var values = parsedData[i]['value'];
        for (var j = 0; j < values.length; j++) {
          values[j] = values[j].substring(values[j].indexOf(":") + 1);
        }
        monthlySubscribersData.push({
					label: yearstart
            ? monthNames[parsedData[i]['label'].substring(5)] + "\n" + parsedData[i]['label'].substring(0, 4)
            : monthNames[parsedData[i]['label'].substring(5)],
          value: parsedData[i]['value'][0].substring(1),
          labelFontColor: labelColor,
          labelFontSize: "12px"
        });

        cumulativeSubscribersData.push({
					label: yearstart
            ? monthNames[parsedData[i]['label'].substring(5)] + "\n" + parsedData[i]['label'].substring(0, 4)
            : monthNames[parsedData[i]['label'].substring(5)],
          value: parsedData[i]['value'][1],
          labelFontColor: labelColor,
          labelFontSize: "12px"
        });
        monthlyViewsData.push({
					label: yearstart
            ? monthNames[parsedData[i]['label'].substring(5)] + "\n" + parsedData[i]['label'].substring(0, 4)
            : monthNames[parsedData[i]['label'].substring(5)],
          value: parsedData[i]['value'][2],
          labelFontColor: labelColor,
          labelFontSize: "12px"
        });
        cumulativeViewsData.push({
					label: yearstart
            ? monthNames[parsedData[i]['label'].substring(5)] + "\n" + parsedData[i]['label'].substring(0, 4)
            : monthNames[parsedData[i]['label'].substring(5)],
          value: parsedData[i]['value'][3],
          labelFontColor: labelColor,
          labelFontSize: "12px"
        });
        monthlyVideosPublishedData.push({
					label: yearstart
            ? monthNames[parsedData[i]['label'].substring(5)] + "\n" + parsedData[i]['label'].substring(0, 4)
            : monthNames[parsedData[i]['label'].substring(5)],
          value: parsedData[i]['value'][4],
          labelFontColor: labelColor,
          labelFontSize: "12px"
        });
        cumulativeVideosPublishedData.push({
					label: yearstart
            ? monthNames[parsedData[i]['label'].substring(5)] + "\n" + parsedData[i]['label'].substring(0, 4)
            : monthNames[parsedData[i]['label'].substring(5)],
          value: parsedData[i]['value'][5],
          labelFontColor: labelColor,
          labelFontSize: "12px"
        });
        commentsAndLikesData[0]['data'].push({
          value: parsedData[i]['value'][6]
        });
        commentsAndLikesData[1]['data'].push({
          value: parsedData[i]['value'][7]
        });
        commentsAndLikesCategory.push({
					label: yearstart
            ? monthNames[parsedData[i]['label'].substring(5)] + "\n" + parsedData[i]['label'].substring(0, 4)
            : monthNames[parsedData[i]['label'].substring(5)],
          labelFontColor: labelColor,
          labelFontSize: "12px"
        });
        mp4PDFDownloadData[0]['data'].push({
          value: parsedData[i]['value'][25]
        });
        mp4PDFDownloadData[1]['data'].push({
          value: parsedData[i]['value'][26]
        });
        mp4PDFDownloadCategory.push({
					label: yearstart
            ? monthNames[parsedData[i]['label'].substring(5)] + "\n" + parsedData[i]['label'].substring(0, 4)
            : monthNames[parsedData[i]['label'].substring(5)],
          labelFontColor: labelColor,
          labelFontSize: "12px"
        });
        pistacjaSessionUserData[0]['data'].push({
          value: parsedData[i]['value'][23]
        });
        pistacjaSessionUserData[1]['data'].push({
          value: parsedData[i]['value'][24]
        });
        pistacjaSessionUserCategory.push({
					label: yearstart
            ? monthNames[parsedData[i]['label'].substring(5)] + "\n" + parsedData[i]['label'].substring(0, 4)
            : monthNames[parsedData[i]['label'].substring(5)],
          labelFontColor: labelColor,
          labelFontSize: "12px"
        });


        averageViews += Number(parsedData[i]['value'][2]);
        desktop += parseFloat(parsedData[i]['value'][8]);
        mobile += parseFloat(parsedData[i]['value'][9]);
        tablet += parseFloat(parsedData[i]['value'][10]);
        tv += parseFloat(parsedData[i]['value'][11]);
        others += parseFloat(parsedData[i]['value'][12]);
      }

      // Device Type Data from percentage to real number.
      averageViews = averageViews / 13;
      averageDeviceTypePercentage[0]['value'] = String((desktop / 1300) * averageViews);
      averageDeviceTypePercentage[0]['displayValue'] = String((desktop/13).toFixed(2)) + '%';

      averageDeviceTypePercentage[1]['value'] = String(mobile / 1300 * averageViews);
      averageDeviceTypePercentage[1]['displayValue'] = String((mobile/13).toFixed(2)) + '%';

      averageDeviceTypePercentage[2]['value'] = String(tablet / 1300 * averageViews);
      averageDeviceTypePercentage[2]['displayValue'] = String((tablet/13).toFixed(2)) + '%';

      averageDeviceTypePercentage[3]['value'] = String(tv / 1300 * averageViews);
      averageDeviceTypePercentage[3]['displayValue'] = String((tv/13).toFixed(2)) + '%';

      averageDeviceTypePercentage[4]['value'] = String(others / 1300 * averageViews);
      averageDeviceTypePercentage[4]['displayValue'] = String((others/13).toFixed(2)) + '%';


			countNumber(2000, cumulativeSubscribersData[cumulativeSubscribersData.length - 1]['value'], '#subscriberNum');
			countNumber(4000, cumulativeViewsData[cumulativeViewsData.length - 1]['value'], '#viewNum');
			countNumber(6000, cumulativeVideosPublishedData[cumulativeVideosPublishedData.length - 1]['value'], '#videoNum');
      $('#updateTime').text("Last updated(UTC): " + JSON.parse(localStorage.getItem("date"))[0].substring(0, 19).replace("T", " "));

      // Update table1:
      var tr1 = document.querySelectorAll('#table1 tr');
      for (var i = 1; i < tr1.length; i++) {
        var td1 = tr1[i].querySelectorAll('td');
				td1[0].innerHTML = (i == 1 || parsedData[i - 1]['label'].substring(5) == "01")
						? parsedData[i - 1]['label'].substring(0, 5) + monthNames[parsedData[i - 1]['label'].substring(5)]
						: monthNames[parsedData[i - 1]['label'].substring(5)];
        td1[0].innerHTML = parsedData[i - 1]['label'];
        for (var j = 1; j < td1.length; j++) {
          td1[j].innerHTML = parsedData[i - 1]['value'][j - 1];
        }
      }

      // Update table2:
      var tr2 = document.querySelectorAll('#table2 tr');
      for (var i = 1; i < tr2.length; i++) {
        var td2 = tr2[i].querySelectorAll('td');
				td2[0].innerHTML = (i == 1 || parsedData[i - 1]['label'].substring(5) == "01")
          ? parsedData[i - 1]['label'].substring(0, 5) + monthNames[parsedData[i - 1]['label'].substring(5)]
          : monthNames[parsedData[i - 1]['label'].substring(5)];
        for (var j = 1; j < td2.length; j++) {
          td2[j].innerHTML = parsedData[i - 1]['value'][j - 1 + 6];
        }
      }


      // Update table3:
      var tr3 = document.querySelectorAll('#table3 tr');
      for (var i = 1; i < tr3.length; i++) {
        var td3 = tr3[i].querySelectorAll('td');
				td3[0].innerHTML = (i == 1 || parsedData[i - 1]['label'].substring(5) == "01")
          ? parsedData[i - 1]['label'].substring(0, 5) + monthNames[parsedData[i - 1]['label'].substring(5)]
          : monthNames[parsedData[i - 1]['label'].substring(5)];
        for (var j = 1; j < td3.length; j++) {
          td3[j].innerHTML = parsedData[i - 1]['value'][j - 1 + 8];
        }
      }

      // Update table4:
      var tr4 = document.querySelectorAll('#table4 tr');
      for (var i = 1; i < tr4.length; i++) {
        var td4 = tr4[i].querySelectorAll('td');
				td4[0].innerHTML = (i == 1 || parsedData[i - 1]['label'].substring(5) == "01")
          ? parsedData[i - 1]['label'].substring(0, 5) + monthNames[parsedData[i - 1]['label'].substring(5)]
          : monthNames[parsedData[i - 1]['label'].substring(5)];
        for (var j = 1; j < td4.length; j++) {
          td4[j].innerHTML = parsedData[i - 1]['value'][j - 1 + 25];
        }
      }

      // Update table5:
      var tr5 = document.querySelectorAll('#table5 tr');
      for (var i = 1; i < tr5.length; i++) {
        var td5 = tr5[i].querySelectorAll('td');
				td5[0].innerHTML = (i == 1 || parsedData[i - 1]['label'].substring(5) == "01")
          ? parsedData[i - 1]['label'].substring(0, 5) + monthNames[parsedData[i - 1]['label'].substring(5)]
          : monthNames[parsedData[i - 1]['label'].substring(5)];
        for (var j = 1; j < td5.length; j++) {
          td5[j].innerHTML = parsedData[i - 1]['value'][j - 1 + 23];
        }
      }

      // Update table6:
      var tr6 = document.querySelectorAll('#table6 tr');
      for (var i = 1; i < tr6.length; i++) {
        var td6 = tr6[i].querySelectorAll('td');
				td6[0].innerHTML = (i == 1 || parsedData[i - 1]['label'].substring(5) == "01")
          ? parsedData[i - 1]['label'].substring(0, 5) + monthNames[parsedData[i - 1]['label'].substring(5)]
          : monthNames[parsedData[i - 1]['label'].substring(5)];
        for (var j = 1; j < td6.length; j++) {
          td6[j].innerHTML = parsedData[i - 1]['value'][j - 1 + 15];
        }
      }

      // Update table7:
      var tr7 = document.querySelectorAll('#table7 tr');
      for (var i = 1; i < tr7.length; i++) {
        var td7 = tr7[i].querySelectorAll('td');
				td7[0].innerHTML = (i == 1 || parsedData[i - 1]['label'].substring(5) == "01")
          ? parsedData[i - 1]['label'].substring(0, 5) + monthNames[parsedData[i - 1]['label'].substring(5)]
          : monthNames[parsedData[i - 1]['label'].substring(5)];
        for (var j = 1; j < td7.length; j++) {
          td7[j].innerHTML = parsedData[i - 1]['value'][j - 1 + 21];
        }
      }

      // Monthly Subscribers Bar Plot:
      new FusionCharts({
        type: 'column2d',
        renderAt: 'monthlySubscribers',
        width: '95%',
        height: '500',
        dataFormat: 'json',
        dataSource: {
          "chart": {
            'caption': 'Youtube Monthly Subscribers',
            'captionFontSize': '20',
            'xAxisName': '{br} Date',
            'xAxisNameFontSize': '15',
            'yAxisName': 'Youtube Subscribers(Monthly)',
            'yAxisNameFontSize': '15',
            'formatNumberScale': '0',
            'paletteColors': '#66b3ff',
            'bgColor': '#ffffff',
            'borderAlpha': '0',
            'canvasBorderAlpha': '0',
            'usePlotGradientColor': '0',
            'plotBorderAlpha': '0',
            'plotBorderColor': '#ffffff',
            'placevaluesInside': '0',
            'valueFontColor': '#6666ff',
            'valueFontSize': '12',
            'valueFontBold': '0.7',
            'valueFontAlpha': '50',
            'divlineColor': '#999999',
            'divlineIsDashed': '1',
            'showAlternateHGridColor': '0',
            'toolTipBgColor': 'transparent',
            'toolTipPadding': '12',
            'toolTipBorderColor': '#0080ff',
            'toolTipBorderRadius': '3',
            'toolTipBorderThickness': '1',
            'plotToolText': '<div style="font-size: 14px; color: #0080ff">$label: $value</div>'
          },
          "data": monthlySubscribersData
        }
      }).render();


      // Cumulative Subscribers Bar Plot:
      new FusionCharts({
        type: 'column2d',
        renderAt: 'cumulativeSubscribers',
        width: '95%',
        height: '500',
        dataFormat: 'json',
        dataSource: {
          "chart": {
            'caption': 'Youtube Cumulative Subscribers',
            'captionFontSize': '20',
            'xAxisName': '{br} Date',
            'xAxisNameFontSize': '15',
            'yAxisName': 'Youtube Subscribers(Cumulative)',
            'yAxisNameFontSize': '15',
            'formatNumberScale': '0',
            'paletteColors': '#ff9999',
            'bgColor': '#ffffff',
            'borderAlpha': '0',
            'canvasBorderAlpha': '0',
            'usePlotGradientColor': '0',
            'plotBorderAlpha': '0',
            'plotBorderColor': '#ffffff',
            'placevaluesInside': '0',
            'valueFontColor': '#ff4d4d',
            'valueFontSize': '12',
            'valueFontBold': '0.7',
            'valueFontAlpha': '50',
            'divlineColor': '#999999',
            'divlineIsDashed': '1',
            'showAlternateHGridColor': '0',
            'toolTipBgColor': 'transparent',
            'toolTipPadding': '12',
            'toolTipBorderColor': '#ff3333',
            'toolTipBorderRadius': '3',
            'toolTipBorderThickness': '1',
            'plotToolText': '<div style="font-size: 14px; color: #ff3333">$label: $value</div>'
          },
          "data": cumulativeSubscribersData
        }
      }).render();

      // Monthly Views Bar Plot:
      new FusionCharts({
        type: 'column2d',
        renderAt: 'monthlyViews',
        width: '95%',
        height: '500',
        dataFormat: 'json',
        dataSource: {
          "chart": {
            'caption': 'Youtube Monthly Views',
            'captionFontSize': '20',
            'xAxisName': '{br} Date',
            'xAxisNameFontSize': '15',
            'yAxisName': 'Youtube Views(Monthly)',
            'yAxisNameFontSize': '15',
            'formatNumberScale': '0',
            'paletteColors': '#bfff00',
            'bgColor': '#ffffff',
            'borderAlpha': '0',
            'canvasBorderAlpha': '0',
            'usePlotGradientColor': '0',
            'plotBorderAlpha': '0',
            'plotBorderColor': '#ffffff',
            'placevaluesInside': '0',
            'valueFontColor': '#80ff00',
            'valueFontSize': '12',
            'valueFontBold': '0.7',
            'valueFontAlpha': '50',
            'divlineColor': '#999999',
            'divlineIsDashed': '1',
            'showAlternateHGridColor': '0',
            'toolTipBgColor': 'transparent',
            'toolTipPadding': '12',
            'toolTipBorderColor': '#00ff00',
            'toolTipBorderRadius': '3',
            'toolTipBorderThickness': '1',
            'plotToolText': '<div style="font-size: 14px; color: #00ff00">$label: $value</div>'
          },
          "data": monthlyViewsData
        }
      }).render();

      // Cumulative Views Bar Plot:
      new FusionCharts({
        type: 'column2d',
        renderAt: 'cumulativeViews',
        width: '95%',
        height: '500',
        dataFormat: 'json',
        dataSource: {
          "chart": {
            'caption': 'Youtube Cumulative Views',
            'captionFontSize': '20',
            'xAxisName': '{br} Date',
            'xAxisNameFontSize': '15',
            'yAxisName': 'Youtube Views(Cumulative)',
            'yAxisNameFontSize': '15',
            'formatNumberScale': '0',
            'paletteColors': '#ffbf00',
            'bgColor': '#ffffff',
            'borderAlpha': '0',
            'canvasBorderAlpha': '0',
            'usePlotGradientColor': '0',
            'plotBorderAlpha': '0',
            'plotBorderColor': '#ffffff',
            'placevaluesInside': '0',
            'valueFontColor': '#ff9966',
            'valueFontSize': '12',
            'valueFontBold': '0.7',
            'valueFontAlpha': '50',
            'divlineColor': '#999999',
            'divlineIsDashed': '1',
            'showAlternateHGridColor': '0',
            'toolTipBgColor': 'transparent',
            'toolTipPadding': '12',
            'toolTipBorderColor': '#ff8c66',
            'toolTipBorderRadius': '3',
            'toolTipBorderThickness': '1',
            'plotToolText': '<div style="font-size: 14px; color: #ff8c66">$label: $value</div>'
          },
          "data": cumulativeViewsData
        }
      }).render();

      // Monthly Videos Published Bar Plot:
      new FusionCharts({
        type: 'column2d',
        renderAt: 'monthlyVideosPublished',
        width: '95%',
        height: '500',
        dataFormat: 'json',
        dataSource: {
          "chart": {
            'caption': 'Youtube Monthly Videos Published',
            'captionFontSize': '20',
            'xAxisName': '{br} Date',
            'xAxisNameFontSize': '15',
            'yAxisName': 'Youtube Videos Published(Monthly)',
            'yAxisNameFontSize': '15',
            'formatNumberScale': '0',
            'paletteColors': '#b3b3ff',
            'bgColor': '#ffffff',
            'borderAlpha': '0',
            'canvasBorderAlpha': '0',
            'usePlotGradientColor': '0',
            'plotBorderAlpha': '0',
            'plotBorderColor': '#ffffff',
            'placevaluesInside': '0',
            'valueFontColor': '#6666ff',
            'valueFontSize': '12',
            'valueFontBold': '0.7',
            'valueFontAlpha': '50',
            'divlineColor': '#999999',
            'divlineIsDashed': '1',
            'showAlternateHGridColor': '0',
            'toolTipBgColor': 'transparent',
            'toolTipPadding': '12',
            'toolTipBorderColor': '#9966ff',
            'toolTipBorderRadius': '3',
            'toolTipBorderThickness': '1',
            'plotToolText': '<div style="font-size: 14px; color: #9966ff">$label: $value</div>'
          },
          "data": monthlyVideosPublishedData
        }
      }).render();

      // Cumulative Videos Published Bar Plot:
      new FusionCharts({
        type: 'column2d',
        renderAt: 'cumulativeVideosPublished',
        width: '95%',
        height: '500',
        dataFormat: 'json',
        dataSource: {
          "chart": {
            'caption': 'Youtube Cumulative Videos Published',
            'captionFontSize': '20',
            'xAxisName': '{br} Date',
            'xAxisNameFontSize': '15',
            'yAxisName': 'Youtube Videos Published(Cumulative)',
            'yAxisNameFontSize': '15',
            'formatNumberScale': '0',
            'paletteColors': '#ff99cc',
            'bgColor': '#ffffff',
            'borderAlpha': '0',
            'canvasBorderAlpha': '0',
            'usePlotGradientColor': '0',
            'plotBorderAlpha': '0',
            'plotBorderColor': '#ffffff',
            'placevaluesInside': '0',
            'valueFontColor': '#ff4da6',
            'valueFontSize': '12',
            'valueFontBold': '0.7',
            'valueFontAlpha': '50',
            'divlineColor': '#999999',
            'divlineIsDashed': '1',
            'showAlternateHGridColor': '0',
            'toolTipBgColor': 'transparent',
            'toolTipPadding': '12',
            'toolTipBorderColor': '#ff4d88',
            'toolTipBorderRadius': '3',
            'toolTipBorderThickness': '1',
            'plotToolText': '<div style="font-size: 14px; color: #ff4d88">$label: $value</div>'
          },
          "data": cumulativeVideosPublishedData
        }
      }).render();

      // Comments and Number of Likes:
      new FusionCharts({
        type: 'MSColumn2D',
        renderAt: 'commentsAndLikes',
        width: '95%',
        height: '500',
        dataFormat: 'json',
        dataSource: {
          "chart": {
            'caption': 'Youtube Monthly Comments and Number of Likes',
            'captionFontSize': '20',
            'xAxisName': '{br} Date',
            'xAxisNameFontSize': '15',
            'yAxisName': 'Number of Comments and Likes',
            'yAxisNameFontSize': '15',
            'formatNumberScale': '0',
            'paletteColors': '#ff9999, #66ccff',
            'bgColor': '#ffffff',
            'borderAlpha': '0',
            'canvasBorderAlpha': '0',
            'usePlotGradientColor': '0',
            'plotBorderAlpha': '0',
            'plotBorderColor': '#ffffff',
            'placevaluesInside': '0',
            'valueFontColor': '#bf80ff',
            'valueFontSize': '12',
            'valueFontBold': '0.7',
            'valueFontAlpha': '50',
            'divlineColor': '#999999',
            'divlineIsDashed': '1',
            'showAlternateHGridColor': '0',
            'showHoverEffect': '1',
            'showToolTip': '1',
            'toolTipBgColor': 'transparent',
            'toolTipPadding': '12',
            'toolTipBorderColor': '#7300e6',
            'toolTipBorderRadius': '3',
            'toolTipBorderThickness': '1',
            'plotToolText': '<div style="font-size: 14px; color: #7300e6">$label $seriesname: $value</div>',
            'legendBgAlpha': '0',
            'legendBorderAlpha': '0',
            'legendShadow': '0',
            'legendItemFontSize': '15',
            'legendItemFontColor': '#666666',
            'showHoverEffect': '1'
          },
          "categories": [{
            'category': commentsAndLikesCategory
          }],
          "dataset": commentsAndLikesData
        }
      }).render();

      // Average Views grouped by Device type
      new FusionCharts({
        type: 'pie2d',
        renderAt: 'averageDeviceTypePercentage',
        width: '95%',
        height: '500',
        dataFormat: 'json',
        dataSource: {
          "chart": {
            'caption': 'Average Views Grouped by Device Type',
            'captionFontSize': '20',
            'paletteColors': '#6002EE, #90EE02, #FCCA46, #A1C181, #579C87',
            'bgColor': '#ffffff',
            'showBorder': '0',
            'use3DLighting': '0',
            'showShadow': '0',
            'enableSmartLabels': '1',
            'startingAngle': '0',
            'showPercentValues': '1',
            'showPercentInTooltip': '1',
            'decimals': '1',
            'toolTipColor': '#7575a3',
            'toolTipBorderThickness': '1',
            'toolTipBorderRadius': '3',
            'toolTipBorderColor': '#7575a3',
            'toolTipBgColor': 'transparent',
            'toolTipPadding': '12',
            'plotToolText': '<div style="font-size: 14px; font-weight: bold">$label: $displayValue</div>',
            'showHoverEffect': '1',
            'showLegend': '1',
            'labelFontColor': '#7e8589',
            'labelFontSize': '13',
            'labelFontBold': '1',
            'legendBorderAlpha': '0',
            'legendItemFontSize': '13'
          },
          "data": averageDeviceTypePercentage
        }
      }).render();

      // Pistacja MP4 & PDF Downloads
      new FusionCharts({
        type: 'MSColumn2D',
        renderAt: 'mp4AndPdfDownloads',
        width: '95%',
        height: '500',
        dataFormat: 'json',
        dataSource: {
          "chart": {
            'caption': 'Pistacja monthly MP4 and PDF Downloads',
            'captionFontSize': '20',
            'xAxisName': '{br} Date',
            'xAxisNameFontSize': '15',
            'yAxisName': 'Number of MP4 and PDF Downloads',
            'yAxisNameFontSize': '15',
            'formatNumberScale': '0',
            'paletteColors': '#68bcec, #ff80bf',
            'bgColor': '#ffffff',
            'borderAlpha': '0',
            'canvasBorderAlpha': '0',
            'usePlotGradientColor': '0',
            'plotBorderAlpha': '0',
            'plotBorderColor': '#ffffff',
            'placevaluesInside': '0',
            'valueFontColor': '#8080ff',
            'valueFontSize': '12',
            'valueFontBold': '0.7',
            'valueFontAlpha': '50',
            'divlineColor': '#999999',
            'divlineIsDashed': '1',
            'showAlternateHGridColor': '0',
            'showHoverEffect': '1',
            'showToolTip': '1',
            'toolTipBgColor': 'transparent',
            'toolTipPadding': '12',
            'toolTipBorderColor': '#3333cc',
            'toolTipBorderRadius': '3',
            'toolTipBorderThickness': '1',
            'plotToolText': '<div style="font-size: 14px; color: #3333cc">$label $seriesname: $value</div>',
            'legendBgAlpha': '0',
            'legendBorderAlpha': '0',
            'legendShadow': '0',
            'legendItemFontSize': '15',
            'legendItemFontColor': '#666666',
            'showHoverEffect': '1'
          },
          "categories": [{
            'category': mp4PDFDownloadCategory
          }],
          "dataset": mp4PDFDownloadData
        }
      }).render();


      // Pistacja Sessions & Users Downloads
      new FusionCharts({
        type: 'MSColumn2D',
        renderAt: 'pistacjaSessionUser',
        width: '95%',
        height: '500',
        dataFormat: 'json',
        dataSource: {
          "chart": {
            'caption': 'Pistacja monthly Sessions and Users',
            'captionFontSize': '20',
            'xAxisName': '{br} Date',
            'xAxisNameFontSize': '15',
            'yAxisName': 'Number of Sessions and Users',
            'yAxisNameFontSize': '15',
            'formatNumberScale': '0',
            'paletteColors': '#8383e2, #9be283',
            'bgColor': '#ffffff',
            'borderAlpha': '0',
            'canvasBorderAlpha': '0',
            'usePlotGradientColor': '0',
            'plotBorderAlpha': '0',
            'plotBorderColor': '#ffffff',
            'placevaluesInside': '0',
            'valueFontColor': '#b383e2',
            'valueFontSize': '12',
            'valueFontBold': '0.7',
            'valueFontAlpha': '50',
            'divlineColor': '#999999',
            'divlineIsDashed': '1',
            'showAlternateHGridColor': '0',
            'showHoverEffect': '1',
            'showToolTip': '1',
            'toolTipBgColor': 'transparent',
            'toolTipPadding': '12',
            'toolTipBorderColor': '#6666ff',
            'toolTipBorderRadius': '3',
            'toolTipBorderThickness': '1',
            'plotToolText': '<div style="font-size: 14px; color: #6666ff">$label $seriesname: $value</div>',
            'legendBgAlpha': '0',
            'legendBorderAlpha': '0',
            'legendShadow': '0',
            'legendItemFontSize': '15',
            'legendItemFontColor': '#666666',
            'showHoverEffect': '1'
          },
          "categories": [{
            'category': pistacjaSessionUserCategory
          }],
          "dataset": pistacjaSessionUserData
        }
      }).render();
    }
  });
}



// Move slides with slider arrows:
var slideIndex = 0;

function changeSlide(n) {
  slideIndex += n;
  changeSlideHelper(slideIndex);
}

function currentSlide(n) {
  slideIndex = n;
  changeSlideHelper(slideIndex);
}

function changeSlideHelper(idx) {
  if (idx < 0) {
    slideIndex = dataTables.length - 1;
  }
  if (idx == dataTables.length) {
    slideIndex = 0;
  }
  for (var i = 0; i < dataTables.length; i++) {
    dataTables[i].style.display = 'none';
  }
  for (var i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(' active', '');
  }
  dots[slideIndex].className += ' active';
  dataTables[slideIndex].style.display = 'table';
}






// Automatics slide show for chart display
var index2 = 0;
function automaticSlideShowChart() {
  if (slideShowState) {
    for (var j = 0; j < charts.length; j++) {
      charts[j].style.display = 'none';
    }
    index2 += 1;
    if (index2 > charts.length) {
      index2 = 1;
    }
    charts[index2 - 1].style.display = 'block';
    setTimeout(automaticSlideShowChart, 30000);
  } else {
    clearTimeout(automaticSlideShowChart);
  }
}

automaticSlideShowChart();



function datatime() {
  if (! navigator.onLine && ! localStorage.getItem("pistacja_data") == null) {
    return "Using data from " + JSON.parse(localStorage.getItem("date"))[0].substring(0, 10);
  } else {
    return "";
  }
}


function countNumber(delay, number, id) {
	// run = true;
	$({ Counter: 0 }).delay(delay).animate({
			Counter: number
		}, {
			duration: 4000,
			easing: 'swing',
			step: function() {
				$(id).text(Math.ceil(this.Counter));
			}
	});
}
