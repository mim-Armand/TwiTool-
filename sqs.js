const AWS = require('aws-sdk');
const sqs = new AWS.SQS({'region': process.env.TWITOOL_AWS_REGION || 'us-east-1'});

const createQueue = function (args) {
    args = args || {};
    const params = {
        QueueName: args.queueName || 'twitool',
        Attributes: {
            VisibilityTimeout: (args.VisibilityTimeout || '720') + ''
        }
    }
    return new Promise(function (resolve, reject) {
        sqs.createQueue(params, function (err, data) {
            if (err) reject(err)
            resolve(data)
        })
    })
}

const sendMessage = function (QueueUrl, MessageBody, DelaySeconds) {
    console.log('sending message ...')
    const params = {QueueUrl: QueueUrl, MessageBody: MessageBody, DelaySeconds: DelaySeconds || 0}
    return new Promise(function (resolve, reject) {
        sqs.sendMessage(params, function(err, data){
            if(err) reject(err)
            resolve(data)
        })
    })
}

const addFollowersCheck = function(QueueUrl, user_id, screen_name, next_cursur, DelaySeconds){
    const MessageBody = {
        user_id: user_id,
        screen_name: screen_name,
        next_cursur: next_cursur
    }
    return new Promise(function(resolve, reject){
        sendMessage(QueueUrl, JSON.stringify(MessageBody), DelaySeconds|| 0 )
            .then(function(d){
                resolve(d)
            })
            .catch(function(r){
                reject(r)
            })
    })
}

const receiveMessage = function(QueueUrl){
    const params = {
        QueueUrl: QueueUrl,
        AttributeNames: ['All'],
        MaxNumberOfMessages: 1,
        // MessageAttributeNames: ['STRING_VALUE'],
        VisibilityTimeout: 60,
        WaitTimeSeconds: 0
    }
    return new Promise(function(resolve, reject){
        sqs.receiveMessage(params, function(err, data){
            if(err) reject(err)
            resolve(data)
        })
    })
}

const deleteMessage = function(QueueUrl, ReceiptHandle){
    var params = {
        QueueUrl: QueueUrl,
        ReceiptHandle: ReceiptHandle
    };
    return new Promise(function(resolve, reject){
        sqs.deleteMessage(params, function(err, data){
            if(err) reject(err)
            resolve(data)
        })
    })
}

const getQueueUrl = function (QueueName) {
    return new Promise(function(resolve, reject){
        sqs.getQueueUrl({QueueName: QueueName}, function(err, data){
            if(err) reject(err)
            resolve(data)
        })
    })
}


module.exports = {
    createQueue: createQueue,
    sendMessage: sendMessage,
    getQueueUrl: getQueueUrl,
    addFollowersCheck: addFollowersCheck,
    receiveMessage: receiveMessage,
    deleteMessage: deleteMessage
}