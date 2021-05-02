const randomPuppy = require('random-puppy');
const fetch = require('node-fetch');
const { prefix, memeReddits, memeDeleteMessagesOnCommand, memeMessageDeleteDelay } = require("../config.json");

var memeMessageDeleteDelayNum = parseInt(memeMessageDeleteDelay, 10)

module.exports = 
{
    config: {
        name: "meme",
        aliases: [],
        description: `Posts a random meme from reddit
        Subreddits: ***${memeReddits.join(", ")}***
        Usage: ***${prefix}meme***
        Aliases: ***None***`
    },

    run: async(bot, message, args) =>
    {
        if(args[1]) { message.reply("No arguments are needed for this command"); }

        if(memeDeleteMessagesOnCommand == "true") 
        { 
            message.delete({timeout : memeMessageDeleteDelayNum * 1000}).catch(err => console.log("Error - ", err.message));
        }


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
        });
        await message.channel.stopTyping(true);
    }
}
