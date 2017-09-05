const Twitter = require('twitter');
const process = require('process');

const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});


const getFollowers = function (user_id, next_cursor, count) {
    return new Promise(function (resolve, reject) {
        // resolve('TODO: remove this line!')
        client.get('followers/ids',
            {
                "user_id": user_id,
                "cursor": next_cursor || '-1',
                "count": count || '5000'
            }).then(
            function (list) {
                if (list.errors) reject(list.errors)
                resolve(list)
            },
            function (err) {
                reject(err)
            })
    });
}

const getUserShow = function (screenName) {
    return new Promise(function(resolve, reject) {
        client.get('users/show', {"screen_name": screenName})
            .then(function(d){
                // console.log('getUserShow', d)
                resolve(d)
            })
            .catch(function(r){
                // console.error('getUserShow', r)
                reject(d)
            })
    })
}

module.exports = {
    getFollowers: getFollowers,
    getUserShow: getUserShow
}