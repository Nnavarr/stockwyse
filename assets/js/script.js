var apiKey = 'OeK23R7rjQ4edxtzHNhH44rjXhs0dZJE1kxtmnfG';

// stock symbol element
var tickerEl = document.getElementById('name');
var searchBtnEl = document.getElementById('search-btn');

// function for extracting and plotting stock symbol
var plotPrice = function(){
	var symbol = tickerEl.value;
	console.log(symbol);

	// create url based on stock ticker passed
	var yahooChartUrl = `https://yfapi.net/v8/finance/spark?interval=1d&range=12mo&symbols=${symbol}`; 
	
	// fetch process for yahoo finance api 
	fetch(yahooChartUrl, {
		"method": "GET",
		"headers": {
			"x-api-key": apiKey
		}
	})
	.then(function(response) {
		response.json().then(function(data) {

			// console.log(data);
			var closingPrice = data[symbol].close;
			var timestamps = data[symbol].timestamp;
			var dataArray = [];

			// iterate through dates and prices
			for (var i = 0; i < closingPrice.length; i++){
				var obj = [timestamps[i] * 1000, closingPrice[i]];
				dataArray.push(obj)													
			}

			// chart data
			Highcharts.stockChart('container', {
				rangeSelector: {
					selected: 1
				},
				title: {
					text: `${symbol} Stock Price`
				},
				series: [{
					name: `${symbol}`,
					data: dataArray,
					tooltip: {
						valueDecimals: 2
					}
				}]
			})
		})
	})
}

// Highcharts.getJSON('https://demo-live-data.highcharts.com/aapl-c.json', function (data) {
// 	// console.log(data);

// // Create the chart
//     Highcharts.stockChart('container', {
//         rangeSelector: {
//             selected: 1
//         },

//         title: {
//             text: 'AAPL Stock Price'
//         },

//         series: [{
//             name: 'AAPL',
//             data: data,
//             tooltip: {
//                 valueDecimals: 2
//             }
//         }]
//     });
// });


// // stock data api test
// var stockDataUrl = 'https://api.stockdata.org/v1/news/all?symbols=AMD&filter_entities=true&language=en&api_token=0xO52bbSZgqSf4Ebeg7bZCxTxh023bFgZhxuOYwJ';
// fetch(stockDataUrl).then(function(response){
// 	response.json().then(function(data) {
// 		console.log(data)
// 	})
// })

// // line chart of stock data
// chartEl = document.getElementById('line-chart').getContext('2d');
// var lineChart = new Chart(chartEl, {
// 	type: 'line',
// 	data: ;

// })

// event listeners
searchBtnEl.addEventListener('click', plotPrice);