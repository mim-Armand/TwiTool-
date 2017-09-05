// 1. Create a folder with users display_name
// 2. Add user information to the main users.json file
//  // 1. Get the users.json and add the new user to the list
//  // 2. Put the users.json with the added information back!
// 3. Add a initializing request to the SQS queue

const s3db = require('./s3db.js');
const sqs = require('./sqs.js');
const twitterClient = require('./twitterClient.js');


const addtUser = function (projectName, displayName) {
    return new Promise(function (resolve, reject) {
        s3db.putObject(projectName, displayName + '/', 'User Display Name is: ' + displayName)
            .then(function(d){
                s3db.getJson(projectName, 'users.json')
                    .then(function(usersData){
                        twitterClient.getUserShow(displayName)
                            .then(function(userDetail){
                                if( usersData.users.indexOf(userDetail.id) === -1 || true){ //TODO: <<< remove the `|| true` on this line
                                    usersData.users.push(userDetail.id)
                                    s3db.putObject(projectName, 'users/' + userDetail.id, JSON.stringify(userDetail))
                                    s3db.putObject(projectName, displayName + "/index.json", JSON.stringify({ "passes": []}))
                                    // sqs.
                                    sqs.getQueueUrl(projectName)
                                        .then(function(d){
                                            sqs.addFollowersCheck(d.QueueUrl, userDetail.id, displayName, -1)
                                                .then(function(d){
                                                    console.log('DONE adding the user ', displayName)
                                                    resolve(d)
                                                })
                                        })
                                        .catch(function(r){
                                            console.error('Error gtting the SQS queue URL!', r)
                                        })
                                }else console.error("User already exists: ", displayName, userDetail.id);
                                s3db.putObject(projectName, 'users.json', JSON.stringify(usersData))
                            })
                            .catch(function(r){
                                console.error('Error getting user details!', r)
                            })
                    })
            })
            .catch(function(r){
                console.error('here!', r)
            })
    })
}


module.exports = {
    addtUser: addtUser
}