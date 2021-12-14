// api variables
var apiKey = 'OeK23R7rjQ4edxtzHNhH44rjXhs0dZJE1kxtmnfG';

// stock symbol element
var tickerEl = document.getElementById('name');
var searchBtnEl = document.getElementById('search-btn');

// global variables
var symbol = '';

// function for extracting and plotting stock symbol
var plotPrice = function(){
	symbol = tickerEl.value;

	// create url based on stock ticker passed (yahoo finance)
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

			// create array to contain timestamp/close pairs
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
					text: `${symbol} Price`
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

		// call stock sentiment API function
		stockSentiment(symbol);
	})
}

// function for extracting stock sentiment from stockdata API
var stockSentiment = function(symbol){
	// stock data api test
	var stockDataUrl = `https://api.stockdata.org/v1/news/all?symbols=${symbol}&filter_entities=true&language=en&api_token=0xO52bbSZgqSf4Ebeg7bZCxTxh023bFgZhxuOYwJ`;
	
	fetch(stockDataUrl).then(function(response){
		response.json().then(function(data) {
			console.log(data)
			
			// extract article highlights
			var sentimentScore = data.data[0].entities[0].sentiment_score;
		})
	})
}

// event listeners
searchBtnEl.addEventListener('click', plotPrice, stockSentiment);
