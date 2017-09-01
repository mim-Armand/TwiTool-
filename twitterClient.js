const Twitter = require('twitter');
const process = require('process');

const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});


const getFollowers = function(screen_name, next_cursor, count){
    return new Promise( function( resolve, reject ){
        client.get('followers/ids',
            {
                "screen_name": screen_name,
                "cursor": next_cursor || '-1',
                "count": count || '5000'
            }).then(
                function(list) {
                    if(list.errors) reject(list.errors)
                    resolve(list)
                },
                function(err){
                    reject(err)
                })});
}

module.exports = {
    getFollowers: getFollowers
}