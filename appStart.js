const s3db = require('./s3db.js');
const sqs = require('./sqs.js');
const iam = require('./iam.js');
const cloudWatchEvents = require('./cloudWatchEvents.js');


const initialize = function (projectName) { //TODO: later (when we have formed the structure) we can convert this to a cloudformation.

    const rolePolicy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {
                    "Service": [
                        "lambda.amazonaws.com",
                        "events.amazonaws.com"
                    ]
                },
                "Action": "sts:AssumeRole"
            }
        ]
    }

    return new Promise(function (resolve, reject) {
// 1. Make sure that main bucket exist: --------------------------------------------------------------------------------
        s3db.createBucket(projectName)
            .then(function (data) {
                console.info('Made sure that main BUCKET exist', data)
// 2. Make sure that main queue exist: ---------------------------------------------------------------------------------

                sqs.createQueue()
                    .then(function (d) {
                        console.info('Made sure that main SQS QUEUE exist', d)
// 3. Make sure that main users.json exist -----------------------------------------------------------------------------
                        s3db.existObject(projectName, 'users.json')
                            .then(function(d){
                                if(d) {console.warn('<<< THE USERS.JSON ALREADY EXISTED! >>>')}
                                    s3db.putObject(projectName, 'users.json', '{"users":[]}')
                                        .then(function (d) {
// 4. Create a role for the CloudWatch event ---------------------------------------------------------------------------
                                            iam.createRole(rolePolicy, projectName, 'Twitool role policy.')
                                                .then(function(rolePolicy){
// 5. Create an scheduled CloudWatch event / per twitter application ---------------------------------------------------
                                                    cloudWatchEvents.puteRule( projectName, rolePolicy.Arn, 'TwiTool Event Rule..', 'rate(6 minutes)', 'DISABLED')
                                                        .then(function(eventRule){
                                                            console.log('cloud watch event created', eventRule)
// 6  Create a Lambda function to be called from the CloudWatch Event / per twitter app --------------------------------
// 7  Add Targets to the cloudWatch event rule -------------------------------------------------------------------------
// 8. Start listening for and/or checking the SQS message list ---------------------------------------------------------
                                                            //TODO!
                                                            resolve('Initialization Successful.')
                                                        })
                                                        .catch(function(r){
                                                            console.error('cloud watch failed', r)
                                                        })
                                                }).catch(function(r){
                                                    console.error('Create role failed!', r)
                                                    reject(r)
                                            })
                                        })
                            })
                    })
                    .catch(function (err) {
                        console.error('There were a problem checking/creating the main SQS QUEUE!!! >>> ', err)
                        reject(err)
                    })
            })
            .catch(function (err) {
                console.error('There were a problem checking/creating the main BUCKET!!! >>> ', err)
                reject(err)
            })
    });

}

module.exports = {
    initialize: initialize
}