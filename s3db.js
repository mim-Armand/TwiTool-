const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const createBucket = function (bucketName) {
    const params = {Bucket: bucketName}
    return new Promise(function (resolve, reject) {
        s3.createBucket(params, function (err, data) {
            if (err) {
                reject(err)
            } else {
                // console.log('\ncreateBucket', data)
                resolve(data)
            }
        })
    })
};

const deleteBucket = function (bucketName) {
    const params = {Bucket: bucketName}
    return new Promise(function (resolve, reject) {
        s3.deleteBucket(params, function (err, data) {
            if (err) {
                reject(Error(err))
            } else {
                // console.log('\ndeleteBucket', data)
                resolve(data)
            }
        })
    })
};

const putObject = function (bucket, key, object) {
    const params = {Bucket: bucket, Key: key, Body: object};
    return new Promise(function (resolve, reject) {
        s3.putObject(params, function (err, data) {
            if (err) {
                reject(Error(err))
            } else {
                // console.log('\nputObject', data)
                resolve(data)
            }
        })
    })
};

const getJson = function (bucket, key) {
    const params = {
        Bucket: bucket,
        Key: key,
        // ResponseContentType: 'application/json'
    }
    return new Promise(function (resolve, reject) {
        s3.getObject(params, function (err, data) {
            if (err) reject(err)
            resolve(JSON.parse(data.Body.toString('utf-8')))
        })
    })
}

const deleteObject = function (bucket, key) {
    const params = {Bucket: bucket, Key: key}
    return new Promise(function (resolve, reject) {
        s3.deleteObject(params, function (err, data) {
            if (err) reject(err)
            resolve(data)
        })
    })
}

const existObject = function (bucket, key) {
    const params = {Bucket: bucket, Key: key};
    return new Promise(function (resolve, reject) {
        s3.headObject(params, function (err, data) {
            // console.log('\nexistObject', data, err)
            if (err) resolve(false)
            resolve(true)
        })
    })
}

const getObjectsList = function (bucket, username) {
    const params = {Bucket: bucket, Prefix: username}
    s3.listObjectsV2(params, function (err, data) {
        // console.log(data)
    })
}

module.exports = {
    createBucket: createBucket,
    deleteBucket: deleteBucket,
    putObject: putObject,
    deleteObject: deleteObject,
    getObjectsList: getObjectsList,
    existObject: existObject,
    getJson: getJson
};