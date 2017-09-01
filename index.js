const express = require('express')
const fs = require('fs');
const http = require('http'); // Loads the http module
const Twitter = require('twitter');
const os = require('os');

const s3db = require('./s3db.js');
const twitterClient = require('./twitterClient.js');



const saveLocationBase = os.homedir() + '/Desktop/twitter_db/'

const projectBucketName = 'twitool'; // change this to a unique name!
var displayName = 'mim_Armand';

s3db.createBucket(projectBucketName)
	.then(function(t){
		console.log('cre Ated! ', t)
	})

twitterClient.getFollowers(displayName, '-1', 5000).then( //todo: if next-cursure exist make next calls (after 1 minute timeout) to get the next chinck of data
	function(m){
		console.log(m)

        s3db.putObject(projectBucketName, displayName+'/1', JSON.stringify(m)).then(
        function(t){
        	console.log('put object ', t)
        	}
        )

	},
	function(err){
		console.error(err)
	})





var app = express()
 
app.get('/', function (req, res) {
  res.send('TwiTool!')
})
 
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})










var writeFile = function(file, message){

	var date = new Date();
	var saveLocation = saveLocationBase + date.toString().replace(/\:/g, '_').replace(/\s/g, '_') + '-' + getApi + '/';

	if (!fs.existsSync(saveLocation)){
	    fs.mkdirSync(saveLocation);
	}

	 fs.writeFile(saveLocation + file, JSON.stringify(message), function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    console.log(file + " was saved!");
	}); 
}



// getFollowers();