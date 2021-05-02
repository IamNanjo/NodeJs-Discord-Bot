const randomPuppy = require('random-puppy');
const fetch = require('node-fetch');
const { prefix, memeReddits, amountOfMemesToPost, maxMemesToPost, memesDeleteMessagesOnCommand, memesMessageDeleteDelay } = require("../config.json");

var amountOfMemesToPostNum = parseInt(amountOfMemesToPost, 10)
var maxMemesToPostNum = parseInt(maxMemesToPost, 10)
var memesMessageDeleteDelayNum = parseInt(memesMessageDeleteDelay, 10)

module.exports = { 
    config: {
        name: "memes",
        aliases: [],
        description: `Posts ${amountOfMemesToPostNum} (without arguments) or up to ${maxMemesToPostNum} random memes from reddit
        Subreddits: ***${memeReddits.join(", ")}***
        Usage: ***${prefix}memes [1 - ${maxMemesToPostNum}]***
        Aliases: ***None***
        Example: ***${prefix}memes ${Math.floor(maxMemesToPostNum / 2)}***`
    },
    
    run: async(bot, message, args) =>
    {
        if(memesDeleteMessagesOnCommand == "true") 
        { 
            message.delete({timeout : memesMessageDeleteDelayNum * 1000}).catch(err => console.log("Error - ", err.message));
        }

        if(maxMemesToPostNum < 1) { maxMemesToPostNum = 1; }

        if(!args[1])
        {
            if(amountOfMemesToPostNum < 1) { amountOfMemesToPostNum = 1; }
            for (var i = 1; i <= amountOfMemesToPostNum; i++) {
                let subreddit = memeReddits[Math.floor(Math.random() * memeReddits.length)];
                randomPuppy(subreddit).then(url => {
                    fetch(url).then(async res => {
                        if(typeof res.body == undefined) return i--;
                        if(res.body)
                        {
                            await message.channel.send({
                                files: [{
                                    attachment: res.body,
                                    name: 'meme.png'
                                }]
                            }).catch(err => console.log("Error - ", err.message));
                        }
                    }).catch(err => console.log("Error - ", err.message));
                })
            }
        }
            
        else if(args[1] <= maxMemesToPostNum && args[1] > 0) {
            for (var i = 1; i <= args[1]; i++) {
                let subreddit = memeReddits[Math.floor(Math.random() * memeReddits.length)];
                randomPuppy(subreddit).then(url => {
                    fetch(url).then(async res => {
                        await message.channel.send({
                            files: [{
                                attachment: res.body,
                                name: 'meme.png'
                            }]
                        }).catch(err => console.log("Error - ", err.message))
                    }).catch(err => console.log("Error - ", err.message));
                })
            }
        }
        else { message.reply(`Maximum memes to post at once is ${maxMemesToPostNum}`); }
        await message.channel.stopTyping(true);
    }
}
