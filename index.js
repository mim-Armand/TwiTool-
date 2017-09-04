const express = require('express')
const os = require('os');

const s3db = require('./s3db.js');
const sqs = require('./sqs.js');
const appStart = require('./appStart.js');
const userManagment = require('./userManagment.js');
const cloudWatchEvents = require('./cloudWatchEvents.js');
const iam = require('./iam.js');
const twitterClient = require('./twitterClient.js');


const projectName = 'twitool'; // change this to a unique name!
var displayName = 'mim_Armand';
const pageFetchLimit = 50; // Equals to 250,000 followers = 50 files x 4kb (?!)
var currentPageIndex = 1;


// INITIALIZING THE APP: ===============================================================================================

appStart.initialize( projectName )
    .then(function(d){
      console.info(d)
        addUser()
    })
    .catch(function(r){console.error(r)})

// INITIALIZING USER: ==================================================================================================

const addUser = function(){
    userManagment.addtUser(projectName, 'mim_Armand')
        .then(function(d){
            taskSchdule()
        })
}
// 1. Create a folder with users display_name
// 2. Add user information to the main users.json file
// 3. Add a initializing request to the SQS queue

//======================================================================================================================

// TASK WORKERS (SCHEDULED): ===========================================================================================

const taskSchdule = function(){

}

// 1. each worker checks every minute fo new messages
// 2. worker picks up the task and finishes it
// 3. worker deletes the task
// 4. worker adds a new task to the que as/id needed
// 5. if it was the last task for the particular user ( no next_cursur ) worker adds a restarting task with a long delay

//======================================================================================================================

// TASK STEPS ==========================================================================================================

// 1. Task information ( user_id, display_name, curser )
// 2. Make the call to twitter API
// 3. if successful, add the data to the users folder
// 4. add the data ref/index to the users main index.json file

//======================================================================================================================


// twitterClient.getFollowers(displayName, '-1', 5000).then( //todo: if next-cursure exist make next calls (after 1 minute timeout) to get the next chinck of data
// 	function(m){
// 		console.log(m)
//
//         s3db.putObject(projectName, displayName+'/1', JSON.stringify(m)).then(
//         function(t){
//         	console.log('put object ', t)
//         	}
//         )
//
// 	},
// 	function(err){
// 		console.error(err)
// 	})





var app = express()
 
app.get('/', function (req, res) {
  res.send('TwiTool!')
})
 
app.listen(3000, function () {
  // console.log('Example app listening on port 3000!')
})





// getFollowers();