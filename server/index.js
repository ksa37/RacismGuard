const express = require('express');
const app = express();
const { spawn } = require('child_process');
const { PythonShell } = require("python-shell");

const API_PORT = 3000;

//middleware setting
app.get('/',(req,res)=>{  
	res.json("Python Backend");
})  //req = request 객채 , res = response 객채

//APIs
app.get('/api/classify', (req, res) => {

	// let options = {
	//   scriptPath: "../test.py",
	//   args: ["value1", "value2", "value3"]
	// };

	// PythonShell.run("my_script.py", options, function(err, data) {
	//   if (err) throw err;
	//   console.log(data);
	// });

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


const server = app.listen(API_PORT,() =>{
	console.log('Server is running at http://localhost:', API_PORT)
})
