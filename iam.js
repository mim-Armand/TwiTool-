const AWS = require('aws-sdk')
const iam = new AWS.IAM();

const getRole = function (RoleName){
    return new Promise(function(resolve, reject){
        iam.getRole({RoleName: RoleName}, function(err, data){
            if(err) reject(err)
            resolve(data)
        })
    })
}

const createRole = function (AssumeRolePolicyDocument, RoleName, Description) {
    return new Promise(function (resolve, reject) {
        const params = {
            "RoleName": RoleName || "twitool",
            "Description": Description || "this role is needed for Twittol to function",
            "AssumeRolePolicyDocument": JSON.stringify(AssumeRolePolicyDocument)
        }

        iam.createRole(params, function (err, data) {
            if (err) {
                if(err.code == `EntityAlreadyExists`) {
                    getRole(RoleName)
                        .then(function(dd){
                            console.warn('<<< The role ' + RoleName + ' already existed >>>\nassuming that\'s the correct role and continuing..\nFOUND ROLE:', dd.Role)
                            resolve(dd.Role)
                        })
                        .catch(function(r){
                            console.error('The role already exist but for some reason we couldn\'t retrive it!!')
                            reject(r)
                        })
                }else{
                    reject(err)
                }
            }else resolve(data)
        })

    })
}

// createRole()
//     .then(function (d) {
//         console.log('+++++++++++++', d)
//     })
//     .catch(function (d) {
//         console.error('+++++++++++++', d)
//     })

module.exports = {
    createRole: createRole
}