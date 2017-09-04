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

const deleteMessage = function () {
    console.erro('NOT IMPLEMETED YET!')
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

const addFollowersCheck = function(QueueUrl, user_id, next_cursur){
    const MessageBody = {
        user_id: user_id,
        next_cursur: next_cursur
    }
    return new Promise(function(resolve, reject){
        sendMessage(QueueUrl, JSON.stringify(MessageBody))
            .then(function(d){
                resolve(d)
            })
            .catch(function(r){
                reject(r)
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
    deleteMessage: deleteMessage,
    sendMessage: sendMessage,
    getQueueUrl: getQueueUrl,
    addFollowersCheck: addFollowersCheck
}