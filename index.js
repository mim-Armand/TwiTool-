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
const pageFetchLimit = 50; // Equals to 250,000 followers = 50 files x 55KB


// INITIALIZING THE APP: ===============================================================================================

appStart.initialize( projectName )
    .then(function(d){
      console.info(d)
        addUser("mim_Armand")
        taskSchdule(d.queueData.QueueUrl)
    })
    .catch(function(r){console.error(r)})

// INITIALIZING USER: ==================================================================================================

const addUser = function(screen_name){
    userManagment.addtUser(projectName, screen_name)
        .then(function(d){
        })
}
// 1. Create a folder with users display_name
// 2. Add user information to the main users.json file
// 3. Add a initializing request to the SQS queue

//======================================================================================================================

// TASK WORKERS (SCHEDULED): ===========================================================================================

const taskSchdule = function(QueueUrl){

    setInterval(function(){
        console.log('interval check for the SQS messages in progress!', QueueUrl,'\n.\n..\n...')
        sqs.receiveMessage(QueueUrl)
            .then(function(queueMessage){
                console.log('---',queueMessage,'---')
                if(!queueMessage.Messages) return // <<< if no message was available skip
                const messageBody = JSON.parse(queueMessage.Messages[0].Body)
                twitterClient.getFollowers(messageBody.user_id, messageBody.next_cursur, 5000)
                    .then(function(followersData){
                        console.log('We got the results!', followersData, 'HHHHHHHHH',messageBody.next_cursur)
                        s3db.getJson(projectName, messageBody.screen_name + '/index.json')
                            .then(function(userIndexJson){
                                console.info('index.json in users dir: ', userIndexJson)
                                var passIndex = userIndexJson.passes.length - 1;
                                var fileIndex = 0;
                                if(messageBody.next_cursur + "" == "-1"){
                                    const newPass = {"startTime": (new Date()).getTime(), "endTime": null, "files":[0]}
                                    userIndexJson.passes.push(newPass)
                                    passIndex++;
                                    console.log( "WE HAVE TO ADD A NEW FIELD TO THE USER INDEX.JSON!")
                                } else{ //TODO! CHECK >> push to the files array inside the above object instead!
                                    fileIndex = userIndexJson.passes[ passIndex ].files.length || 0;
                                    userIndexJson.passes[ passIndex ].files.push( messageBody.next_cursur )
                                    console.log("CONTINUE ADDING DATA TO THE LATEST INDEX!")
                                }
                                s3db.putObject(projectName, messageBody.screen_name + '/index.json', JSON.stringify(userIndexJson))
                                    .then(function(){
                                        console.log('user index was updated!')
                                        s3db.putObject(projectName, messageBody.screen_name +'/' + passIndex + '/' + ( fileIndex ), JSON.stringify(followersData))
                                            .then( function(t){
                                            console.log('followersData ', t)
                                                // 1. delete the message
                                                sqs.deleteMessage(QueueUrl, queueMessage.Messages[0].ReceiptHandle)
                                                    .then(function(d){
                                                        console.info('Deletetd the queue message, ', d)
                                                        // 2. create the next cycle message
                                                        const nxt_cursur = (followersData.next_cursor !== 0) ? followersData.next_cursor : -1
                                                        const nxt_delay  = (followersData.next_cursor !== 0) ? 1 : 900
                                                        if(fileIndex < pageFetchLimit) {
                                                            sqs.addFollowersCheck(QueueUrl, messageBody.user_id, messageBody.screen_name, nxt_cursur, nxt_delay)
                                                                .then(function (d) {
                                                                    console.info('the cycle is complete! we added a message to the que for the next cycle!', d)
                                                                })
                                                                .catch(function (r) {
                                                                    console.error('There were a problem adding the next cycle request to the message queue!', r)
                                                                })
                                                        }else{
                                                            console.warn('User ' + messageBody.screen_name + ' has reached the maximum allowed limit of ' + pageFetchLimit + ' x 5000 followers', messageBody)
                                                            return;
                                                        }
                                                    })
                                                    .catch(function(r){
                                                        console.error('There were a problem deleting the message from the queue', r)
                                                    })
                                            })
                                            .catch(function(r){
                                                console.error('An error ocured while trying to put S3 object!', r)
                                            })
                                    })
                                    .catch(function(r){
                                        console.error('There were a problem updating user\'s index.json file!', r)
                                    })
                            })
                            .catch(function(r){
                                console.error('Problem catching the user index.json file data!',r)
                            })
                    })
                    .catch(function(r){
                        console.error('An erro ocured while trying to retrive followers from Twitter!', r)
                    })
            })
            .catch(function(d){
                console.error('There were a problem catching the QUEUEURL', d)
            })
    }, 60000)

}

// 1. each worker checks every minute fo new messages
// 2. worker picks up the task and finishes it
// 3. worker deletes the task
// 4. worker adds a new task to the que as/id needed
// 5. if it was the last task for the particular user ( no next_cursur ) worker adds a restarting task with a long delay
// 1. Task information ( user_id, display_name, curser )
// 2. Make the call to twitter API
// 3. if successful, add the data to the users folder
// 4. add the data ref/index to the users main index.json file

//======================================================================================================================





var app = express()
 
app.get('/', function (req, res) {
  res.send('TwiTool!')
})
 
app.listen(3000, function () {
  // console.log('Example app listening on port 3000!')
})





// getFollowers();