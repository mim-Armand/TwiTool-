const express = require('express')
const fs = require('fs');
const http = require('http'); // Loads the http module
const Twitter = require('twitter');
const os = require('os');


const getApi = 'friends';
const saveLocation = os.homedir() + '/Desktop/twitter_db/'
var cursurIndex = 1;
var dataToWrite = {"users": []};
var next_cursor = undefined
var date = new Date();




const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});



var app = express()
 
app.get('/', function (req, res) {
  res.send('Hello World')
})
 
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})





// writeFile("./followers.json" , tweets)



var getFollowers = function(){
	client.get(getApi +'/list', {cursor: next_cursor}, function(error, tweets, response) {
	  if(error) console.error(error);

	  if(tweets.errors) {
	  	writeFile("./" + getApi + ".json" , dataToWrite)
	  	return};

	  	for( var i = 0; i < tweets.users.length; i++){
	  		dataToWrite["users"].push( tweets.users[i] )
	  	}


	  writeFile("./"+getApi+"" + cursurIndex + ".json" , tweets)
	  writeFile("./"+getApi+".json" , dataToWrite)
	  cursurIndex++;
	  console.log(cursurIndex, tweets.next_cursor)
	  if(tweets.next_cursor !== 0){
	  	next_cursor = tweets.next_cursor
	  	setTimeout(getFollowers, 66699)
	  }else{
	  	writeFile("./"+getApi+".json" , dataToWrite)
	  }
	});
}


var writeFile = function(file, message, saveLocation){

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


// writeFile('test.txt', 'testin..', saveLocation);
// getFollowers();