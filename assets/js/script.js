var apiKey = 'OeK23R7rjQ4edxtzHNhH44rjXhs0dZJE1kxtmnfG';
var yahooChartUrl = 'https://yfapi.net/v8/finance/spark?interval=1d&range=3mo&symbols=AAPL';

// fetch process for yahoo finance api 
fetch(yahooChartUrl, {
	"method": "GET",
	"headers": {
		"x-api-key": apiKey
	}
})
.then(function(response) {
	console.log(response);
    response.json().then(function(data) {
        console.log(data);
    })
})


// stock data api test
var stockDataUrl = 'https://api.stockdata.org/v1/news/all?symbols=AMD&filter_entities=true&language=en&api_token=0xO52bbSZgqSf4Ebeg7bZCxTxh023bFgZhxuOYwJ';
fetch(stockDataUrl).then(function(response){
	response.json().then(function(data) {
		console.log(data)
	})
})

