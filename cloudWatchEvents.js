const AWS = require('aws-sdk')
const cloudWatchEvents = new AWS.CloudWatchEvents({'region': process.env.TWITOOL_AWS_REGION || 'us-east-1'});


const listRules = function(){
    return new Promise(function (resolve, reject) {
        cloudWatchEvents.listRules(null, function (err, data) {
            if (err) reject(err)
            resolve(data)
        })
    })
}

const puteRule = function (Name, RoleArn, Description, ScheduleExpression, State) {
    return new Promise(function (resolve, reject) {
        var params = {
            Name: Name || 'twitool',
            Description: Description || 'TwiTool rule..',
            // EventPattern: 'STRING_VALUE',
            RoleArn: RoleArn,
            ScheduleExpression: ScheduleExpression || 'rate(5 minutes)',
            State: State || "ENABLED"
        };
        cloudWatchEvents.putRule(params, function (err, data) {
            if (err) reject(err)
            resolve(data)
        })
    })
}

const putTargets = function(Rule){
    return new Promise(function(resolve, reject){
        var params = {
            Rule: Rule || 'twitool',
            Targets: [ /* required */
                {
                    Arn: 'STRING_VALUE', /* required */
                    Id: 'STRING_VALUE', /* required */
                    EcsParameters: {
                        TaskDefinitionArn: 'STRING_VALUE', /* required */
                        TaskCount: 0
                    },
                    Input: 'STRING_VALUE',
                    InputPath: 'STRING_VALUE',
                    InputTransformer: {
                        InputTemplate: 'STRING_VALUE', /* required */
                        InputPathsMap: {
                            '<InputTransformerPathKey>': 'STRING_VALUE',
                            /* '<InputTransformerPathKey>': ... */
                        }
                    },
                    KinesisParameters: {
                        PartitionKeyPath: 'STRING_VALUE' /* required */
                    },
                    RoleArn: 'STRING_VALUE',
                    RunCommandParameters: {
                        RunCommandTargets: [ /* required */
                            {
                                Key: 'STRING_VALUE', /* required */
                                Values: [ /* required */
                                    'STRING_VALUE',
                                    /* more items */
                                ]
                            }
                        ]
                    }
                }
            ]
        };

    })
}


module.exports = {
    puteRule: puteRule,
    listRules: listRules
}