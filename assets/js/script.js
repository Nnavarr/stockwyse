// api variables
var apiKey = 'OeK23R7rjQ4edxtzHNhH44rjXhs0dZJE1kxtmnfG';

// HTML elements
var tickerEl = document.getElementById('name');
var searchBtnEl = document.getElementById('search-btn');
var newsEl = document.getElementById('news');

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
			
			// clear any existing child elements
			while (newsEl.firstChild){
				newsEl.removeChild(newsEl.firstChild);
			}

			// extract articles
			var article1Title = data.data[0].title;
			var article1Url = data.data[0].url;
			var article1Img = data.data[0].image_url;
			var article1Sentiment = data.data[0].entities[0].sentiment_score;

			var article2Title = data.data[1].title;
			var article2Url = data.data[1].url;
			var article2Img = data.data[1].image_url;
			var article2Sentiment = data.data[1].entities[0].sentiment_score;

			// create and append HTML elements
			var article1 = document.createElement('div');
			article1.innerHTML = `<h4 class='is-centered'>${article1Title}</h4><a href=${article1Url} target='_blank'><img src=${article1Img} class='article-img is-centered'>`;
			article1.className = 'column is-6 is-flex-direction-column is-align-content-center';

			var article2 = document.createElement('div');
			article2.innerHTML = `<h4 class='is-flex'>${article2Title}</h4><a href=${article2Url} target='_blank'><img src=${article2Img} class='article-img is-vcentered'>`;
			article2.className = 'column is-centered is-6 is-flex-direction-column';

			newsEl.appendChild(article1);
			newsEl.appendChild(article2);

			// extract sentiment
			var sentimentScore = data.data[0].entities[0].sentiment_score;
		})
	})
}

// event listeners
searchBtnEl.addEventListener('click', plotPrice, stockSentiment);
