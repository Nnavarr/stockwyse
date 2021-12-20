// api variables
var apiKey = 'OeK23R7rjQ4edxtzHNhH44rjXhs0dZJE1kxtmnfG';

// HTML elements
var tickerEl = document.getElementById('name');
var searchBtnEl = document.getElementById('search-btn');
var newsEl = document.getElementById('news');
var historyEl = document.getElementById('stock-history');

// global variables
var symbol = '';

// create historical buttons from the local storage history
var setHistoricalButtons = function(){
	var searchHistory = JSON.parse(localStorage.getItem('stockHistory'));

	// check for presense of history
	if (searchHistory){
		for (i in searchHistory){
			createButton(searchHistory[i].toUpperCase());
		}
	}
}

// new historical button addition
var newHistButton = function(stockTicker){
	// upper case 
	var stockTicker = stockTicker.toUpperCase();

	// pull existing local storage tickers and add new button if its new
	var searchHistory = JSON.parse(localStorage.getItem('stockHistory'));

	if (searchHistory){
		// previous search history present and stockTicker is new
		if ((!searchHistory.includes(stockTicker)) && (searchHistory.length < 10)){
			createButton(stockTicker);
		} else if ((!searchHistory.includes(stockTicker) && searchHistory.length >= 10)) {
			// shift the history array to retain the top 10
			searchHistory.shift();
			console.log(searchHistory);
			searchHistory.push(stockTicker);
			console.log(searchHistory);
			localStorage.setItem('stockHistory', JSON.stringify(searchHistory));
			createButton(stockTicker);
			deleteButton();
		}
	} else {
		// first instance of historical search, add the symbol
		createButton(stockTicker);
	}
}

//  function used to create historical buttons
var createButton = function(textVal) {
	var historicalSearchBtn = document.createElement('button');
	historicalSearchBtn.innerText = textVal.toUpperCase();

	// add class for bulma formatting and append to container
	historicalSearchBtn.className = 'button is-primary is-outlined is-small'
	historyEl.append(historicalSearchBtn);
}

var deleteButton = function(){
	var firstBtn = historyEl.childNodes[0];
	historyEl.removeChild(firstBtn);
}

// call historical buttons function
setHistoricalButtons();

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

		// update historical button
		newHistButton(symbol);

		// update search history
		loadHistory();
		saveHistory();
	})
}

// function for extracting stock sentiment from stockdata API
var stockSentiment = function(symbol){
	// stock data api test
	var stockDataUrl = `https://api.stockdata.org/v1/news/all?symbols=${symbol}&filter_entities=true&language=en&api_token=0xO52bbSZgqSf4Ebeg7bZCxTxh023bFgZhxuOYwJ`;
	
	fetch(stockDataUrl).then(function(response){
		response.json().then(function(data) {
			
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
			article1.innerHTML = `<h3 class='is-half'>Sentiment: ${article1Sentiment}</h3><h4 class='is-centered'>${article1Title}</h4><a href=${article1Url} target='_blank'><img src=${article1Img} class='article-img is-centered'>`;
			article1.className = 'column is-3 is-flex-direction-column is-align-content-right is-align-items-center';
			article1.id = 'left-article';

			var article2 = document.createElement('div');
			article2.innerHTML = `<h3 class='is-align-items-center'>Sentiment: ${article2Sentiment}</h5><h4 class='is-flex'>${article2Title}</h4><a href=${article2Url} target='_blank'><img src=${article2Img} class='article-img is-vcentered'>`;
			article2.className = 'column is-3 is-flex-direction-column is-align-content-center is-align-items-center';

			newsEl.appendChild(article1);
			newsEl.appendChild(article2);

		})
	})
}

// local storage history functions 
var loadHistory = function(){
	// load existing search history
	var history = JSON.parse(localStorage.getItem('stockHistory'));

	// create object if its not present
	if (!history){
		history = [];
	}
	return history
}

// save ticker symbol into search history
var saveHistory = function(){
	// load history
	var history = loadHistory();

	// append entered ticker to history only if it's not already present
	var ticker = tickerEl.value.toUpperCase();
	if (!history.includes(ticker)){
		history.push(ticker);
	}

	// update local storage
	localStorage.setItem('stockHistory', JSON.stringify(history));
}

// event listeners
searchBtnEl.addEventListener('click', plotPrice, stockSentiment);

// history button event listener
historyEl.addEventListener('click', function(event){
	// extract historical button stock sybmol & update text box to reflect value
	var clicked = event.target;
	tickerEl.value = clicked.innerText;

	// pull api
	plotPrice()
	stockSentiment()
})