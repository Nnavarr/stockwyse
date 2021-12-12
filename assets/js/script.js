var apiKey = 'OeK23R7rjQ4edxtzHNhH44rjXhs0dZJE1kxtmnfG';
var yahooChartUrl = 'https://yfapi.net/v8/finance/spark?interval=1d&range=3mo&symbols=AAPL';

// fetch process for yahoo finance api 
fetch(yahooChartUrl, {
	"method": "GET",
	"headers": {
		"x-api-key": apiKey
	}
})
.then(response => {
	console.log(response);
    response.json().then(function(data) {
        console.log(data);
    })
})