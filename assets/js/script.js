
// var apiKey = 'OeK23R7rjQ4edxtzHNhH44rjXhs0dZJE1kxtmnfG';
// var yahooChartUrl = 'https://yfapi.net/v8/finance/spark?interval=1d&range=3mo&symbols=AAPL';

// // fetch process for yahoo finance api 
// fetch(yahooChartUrl, {
// 	"method": "GET",
// 	"headers": {
// 		"x-api-key": apiKey
// 	}
// })
// .then(response => {
// 	console.log(response);
//     response.json().then(function(data) {
//         console.log(data);
//     })
// })

// wallstreetbets API
// var wallstreetBetsUrl = 'https://tradestie.com/api/v1/apps/reddit';

// fetch(wallstreetBetsUrl, {
// 	'mode': 'no-cors',
// 	"method": 'GET',
// 	'headers': {
// 		'Content-Type': 'application/json'
// 	}
// 	}).then(function(response) {
// 		response.json().then(function(data) {
// 		console.log(data);
// 	})
// })


// stock sentiment
var apiKey2 = '16814cf0-38f5-49e1-b3f6-9189f51bc2ef';
var apiURL = 'https://www.styvio.com/apiV2/sentiment/AAPL/';

fetch(apiURL + apiKey2).then(function(response){
	console.log(response);
	console.log(apiURL + apiKey2);

})
