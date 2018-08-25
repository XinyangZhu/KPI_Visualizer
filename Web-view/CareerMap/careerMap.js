var backgroundImage1 = document.getElementById('backgroundImage1');
var backgroundImage2 = document.getElementById('backgroundImage2');
var cm_logo = document.getElementById('cm_logo');
var body = document.getElementById('body');
var header = document.getElementsByClassName('header')[0];
var section = document.getElementsByClassName('section')[0];
var numberButton = document.getElementById('numberButton');
var chartButton = document.getElementById('chartButton');
var slideShowNumber = document.getElementsByClassName('slideShow')[0];
var slideShowChart = document.getElementsByClassName('slideShow')[1];
var dataTables = document.querySelectorAll('table');
var charts = document.getElementsByClassName('chart');
var startPauseButton = document.getElementById('startPauseButton');
var dots = document.getElementsByClassName('dot');
var careerMapDropdown = document.getElementById('CM-dropdown');
var careerMapNoDropdown = document.getElementById('CM-no-dropdown');
var slideShowState = true;
var monthNames = {"01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun",
"07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"};


// As soon as the document is loaded:
$(document).ready(function() {
	// Preloader
	setTimeout(function(){
		$('body').addClass('loaded');
    $('body').removeClass('preloaded');
	}, 500);
	// Buttons (number, chart, logo, scrolldown)
	$('.buttons').delay(1400).animate({'top': '23%', 'opacity': 1}, 700);
});


// If numberButton is selected:
numberButton.addEventListener('click', function() {
	cm_logo.parentNode.removeChild(cm_logo);
	header.parentNode.removeChild(header);

  // if (! window.navigator.onLine && localStorage.getItem("careerMap_data") != null) {
  //   document.getElementById('datatime').innerHTML = "Using data from " + JSON.parse(localStorage.getItem("date"))[0].substring(0, 10);
  //   document.getElementById('datatime').style.display = 'block';
  // } else {
  //   document.getElementById('datatime').style.display = 'none';
  // }
  slideShowNumber.style.display = 'block';
  slideShowChart.style.display = 'none';
  numberButton.style.display = 'none';
  chartButton.style.display = 'none';
  careerMapDropdown.style.display = 'block';
  careerMapNoDropdown.style.display = 'none';
});


// If chartButton is selected:
chartButton.addEventListener('click', function() {
	cm_logo.parentNode.removeChild(cm_logo);
	header.parentNode.removeChild(header);

  // if (! window.navigator.onLine && localStorage.getItem("careerMap_data") != null) {
  //   document.getElementById('datatime').innerHTML = "Using data from " + JSON.parse(localStorage.getItem("date"))[0].substring(0, 10);
  //   document.getElementById('datatime').style.display = 'block';
  // } else {
  //   document.getElementById('datatime').style.display = 'none';
  // }
  slideShowNumber.style.display = 'none';
  slideShowChart.style.display = 'block';
  numberButton.style.display = 'none';
  chartButton.style.display = 'none';
  startPauseButton.style.display = 'block';
  careerMapDropdown.style.display = 'block';
  careerMapNoDropdown.style.display = 'none';
  slideShowState = true;
});


// Click Start/Pause Button to start or pause the slide show.
startPauseButton.addEventListener('click', function(e) {
  if (slideShowState) {
    e.target.textContent = 'Start';
    slideShowState = false;
  } else {
    e.target.textContent = 'Pause';
    slideShowState = true;
    automaticSlideShowChart();
  }
});


// Youtube Selection => Number / Chart:
function careerMapSelection(choice) {
  if (choice == 'number') {
    slideShowNumber.style.display = 'block';
    slideShowChart.style.display = 'none';
    startPauseButton.style.display = 'none';
  }
  else {
    slideShowChart.style.display = 'block';
    slideShowNumber.style.display = 'none';
    startPauseButton.style.display = 'block';
    slideShowState = true;
  }
}



var parsedData = [];
var careerMapSessionUserData = [
  {
    seriesname: 'Career Map Sessions',
    data: []
  },
  {
    seriesname: 'Career Map Users',
    data: []
  }
];
var careerMapSessionUserCategory = [];


var spreadsheet = '19KvaY04qRaUYvk_rPWC5qHUgzdwr06Eq4b37VGuHjgY';
var url = 'https://spreadsheets.google.com/feeds/list/' + spreadsheet + '/od6/public/basic?alt=json';


// Offline
if (! window.navigator.onLine) {
  if (localStorage.getItem("careerMap_data") == null) {
    alert("Requires Internet connection.");
  } else {
    // alert("You're offline. Using data from " + JSON.parse(localStorage.getItem("date"))[0].substring(0, 19).replace("T", " ") + " (UTC).");
    parsedData = JSON.parse(localStorage.getItem("careerMap_data"));
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
      careerMapSessionUserData[0]['data'].push({
        value: parsedData[i]['value'][29]
      });

      careerMapSessionUserData[1]['data'].push({
        value: parsedData[i]['value'][30]
      });
      careerMapSessionUserCategory.push({
				label: yearstart
          ? monthNames[parsedData[i]['label'].substring(5)] + "\n" + parsedData[i]['label'].substring(0, 4)
          : monthNames[parsedData[i]['label'].substring(5)],
        labelFontColor: labelColor,
        labelFontSize: "12px"
      });
    }

    countNumber(2000, 316, '#jobcount');
    countNumber(4000, cumulativeUsesr(careerMapSessionUserData[1]['data']), '#userNum');
    $('#updateTime').text("Last updated(UTC): " + JSON.parse(localStorage.getItem("date"))[0].substring(0, 19).replace("T", " "));


    for (var i = 1; i < 14; i++) {
      $('#table1').append('<tr></tr>');
      var tr1 = document.querySelectorAll('#table1 tr');

      for (var j = 0; j < 3; j++) {
        var td1 = document.createElement('TD');
        tr1[i].appendChild(td1);
      }
      var td1 = tr1[i].querySelectorAll('td');
      td1[0].innerHTML = (i == 1 || parsedData[i - 1]['label'].substring(5) == "01")
        ? parsedData[i - 1]['label'].substring(0, 5) + monthNames[parsedData[i - 1]['label'].substring(5)]
        : monthNames[parsedData[i - 1]['label'].substring(5)];

      for (var j = 1; j < td1.length; j++) {
        td1[j].innerHTML = parsedData[i - 1]['value'][j - 1 + 29];
      }
    }

    new FusionCharts({
      type: 'MSColumn2D',
      renderAt: 'careerMapSessionUser',
      width: '95%',
      height: '500',
      dataFormat: 'json',
      dataSource: {
        "chart": {
          'caption': 'Career Map Sessions and Users',
          'captionFontSize': '20',
          'xAxisName': '{br} Date',
          'xAxisNameFontSize': '15',
          'yAxisName': 'Number of Sessions and Users',
          'yAxisNameFontSize': '15',
          'formatNumberScale': '0',
          'paletteColors': '#ffe699, #bf80ff',
          'bgColor': '#ffffff',
          'borderAlpha': '0',
          'canvasBorderAlpha': '0',
          'usePlotGradientColor': '0',
          'plotBorderAlpha': '0',
          'plotBorderColor': '#ffffff',
          'placevaluesInside': '0',
          'valueFontColor': '#668cff',
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
          'category': careerMapSessionUserCategory
        }],
        "dataset": careerMapSessionUserData
      }
    }).render();
  }
} else {                        // On line
  $.getJSON({
    url: url,
    success: function(response) {
      var data = response.feed.entry;
      for (var i = 3; i < data.length; i++) {
        parsedData.push({
          label: data[i].title.$t,
          value: data[i].content.$t.split(', ')
        });
      }

      localStorage.setItem("careerMap_data", JSON.stringify(parsedData));
      var curdate = new Date();
      localStorage.setItem("date", JSON.stringify([curdate]));

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
        careerMapSessionUserData[0]['data'].push({
          value: parsedData[i]['value'][29]
        });

        careerMapSessionUserData[1]['data'].push({
          value: parsedData[i]['value'][30]
        });
        careerMapSessionUserCategory.push({
					label: yearstart
								? monthNames[parsedData[i]['label'].substring(5)] + "\n" + parsedData[i]['label'].substring(0, 4)
								: monthNames[parsedData[i]['label'].substring(5)],
							labelFontColor: labelColor,
							labelFontSize: "12px"
        });
      }

			countNumber(2000, 316, '#jobcount');
			countNumber(4000, cumulativeUsesr(careerMapSessionUserData[1]['data']), '#userNum');
      $('#updateTime').text("Last updated(UTC): " + JSON.parse(localStorage.getItem("date"))[0].substring(0, 19).replace("T", " "));

      for (var i = 1; i < 14; i++) {
        $('#table1').append('<tr></tr>');
        var tr1 = document.querySelectorAll('#table1 tr');

        for (var j = 0; j < 3; j++) {
          var td1 = document.createElement('TD');
          tr1[i].appendChild(td1);
        }
        var td1 = tr1[i].querySelectorAll('td');
        td1[0].innerHTML = (i == 1 || parsedData[i - 1]['label'].substring(5) == "01")
          ? parsedData[i - 1]['label'].substring(0, 5) + monthNames[parsedData[i - 1]['label'].substring(5)]
          : monthNames[parsedData[i - 1]['label'].substring(5)];

        for (var j = 1; j < td1.length; j++) {
          td1[j].innerHTML = parsedData[i - 1]['value'][j - 1 + 29];
        }
      }

      new FusionCharts({
        type: 'MSColumn2D',
        renderAt: 'careerMapSessionUser',
        width: '95%',
        height: '500',
        dataFormat: 'json',
        dataSource: {
          "chart": {
            'caption': 'Career Map Sessions and Users',
            'captionFontSize': '20',
            'xAxisName': '{br} Date',
            'xAxisNameFontSize': '15',
            'yAxisName': 'Number of Sessions and Users',
            'yAxisNameFontSize': '15',
            'formatNumberScale': '0',
            'paletteColors': '#ffe699, #bf80ff',
            'bgColor': '#ffffff',
            'borderAlpha': '0',
            'canvasBorderAlpha': '0',
            'usePlotGradientColor': '0',
            'plotBorderAlpha': '0',
            'plotBorderColor': '#ffffff',
            'placevaluesInside': '0',
            'valueFontColor': '#668cff',
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
            'category': careerMapSessionUserCategory
          }],
          "dataset": careerMapSessionUserData
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


function jobCount() {
	const number = 0;
	fetch('https://mapakarier.org/backend/www/api/v1/occupation/jobsCount', {
		mode: "cors",
		method: "post",
		credentials: "include"
	})
	.then((response) => response.json())
	.then(data => {
		number = data.length;
	});
	return number;
}

function countNumber(delay, number, id) {
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

function cumulativeUsesr(userData) {
	var total = 0;
	for (var i = 0; i < userData.length; i++) {
		var number = Number(userData[i]['value'].replace(/\s/g, ""));
		total += number;
	}
	return total;
}
