const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const createBucket = function(bucketName){
    const params = { Bucket: bucketName }
    return new Promise( function(resolve, reject){
        s3.createBucket( params, function( err, data ){
            if( err ){
                reject(err)
            }else{
                resolve(data)
            }
        })
    })
};

const deleteBucket = function(bucketName){
    const params = { Bucket: bucketName }
    return new Promise( function(resolve, reject){
        s3.deleteBucket(params, function(err, data){
            if(err){
                reject(Error(err))
            }else{
                resolve(data)
            }
        })
    })
};

const putObject = function(bucket, key, object){
    const params = {Bucket: bucket, Key: key, Body: object};
    return new Promise(function(resolve, reject){
        s3.putObject( params, function(err, data){
            if( err ) {
                reject(Error(err))
            }else{
                resolve(data)
            }
        } )
    })
};

module.exports = {
    createBucket: createBucket,
    deleteBucket: deleteBucket,
    putObject: putObject
};