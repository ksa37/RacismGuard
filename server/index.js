const express = require('express');
const app = express();
const { spawn } = require('child_process');
const { PythonShell } = require("python-shell");
const API_PORT = 3000;

app.get('/',(req,res)=>{  
	res.json("Python Backend");
})  

function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

//APIs
app.get('/api/classify', (req, res) => {
	let responseData;
	// const accountId = req.body.accountId ? req.body.accountId : "test";
	const accountId = "test"
	const python = spawn('python', ['../test.py', accountId]);

	python.stdout.on('data', function (data) {
		console.log('Pipe data from python script ...');
		responseData = data.toString();
	});

	python.on('close', (code) => {
		console.log(`child process close all stdio with code ${code}`);
		// send data to browser
		res.send(responseData)
	});
})


app.get('/feeds', (req, res) => {

	let accountId = req.query.username
	// console.log(test)

	if (req.query.username == undefined) {
		accountId = "realDonaldTrump"
	}
	else {
		accountId = req.query.username;
	}

	console.log(accountId)
	
	let options = {
		scriptPath: "../",  
		args: [accountId]
	};

	PythonShell.run("scrap.py", options, function(err, data) {
		if (err) throw err;

		console.log(data)
		if (data[0] == "")
			res.status(200).json("No return data");
		else
	 		res.status(200).json({ data: JSON.parse(data), success: true });
	});
});

const server = app.listen(API_PORT,() =>{
	console.log('Server is running at http://localhost:', API_PORT)
})
