const AWS = require('aws-sdk')
const lambda = new AWS.Lambda({apiVersion: '2015-03-31'});



const createFunction = function(){
    const params = {
        Code: {
        },
        Description: "test",
        FunctionName: "twitool",
        Handler: "souce_file.handler_name", // is of the form of the name of your source file and then name of your function handler
        MemorySize: 128,
        Publish: true,
        Role: "", // replace with the actual arn of the execution role you created
        Runtime: "nodejs4.3",
        Timeout: 15,
        VpcConfig: {
        }
    };
    return new Promise(function(resolve, reject){
        lambda.createFunction(params, function(err, data){
            if(err) reject(err)
            resolve(data)
        })
    })
}