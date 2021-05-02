const randomPuppy = require('random-puppy');
const fetch = require('node-fetch');
const { prefix, redditDeleteMessagesOnCommand, redditMessageDeleteDelay, maxRedditsToSend } = require("../config.json")

var redditMessageDeleteDelayNum = parseInt(redditMessageDeleteDelay, 10)
var maxRedditsToSendNum = parseInt(maxRedditsToSend, 10)

module.exports = 
{
    config: {
        name: "reddit",
        aliases: ["r"],
        description: `Posts a random post from chosen subreddit
        Usage: ***${prefix}reddit [subreddit] ([amount of pictures to send])***
        Aliases: ***r***
        Example: ***${prefix}r softwaregore 10***`
    },

    run: async(bot, message, args) =>
    {
        if(redditDeleteMessagesOnCommand == "true") 
        { 
            message.delete({timeout : redditMessageDeleteDelayNum * 1000}).catch(err => console.log("Error - ", err.message));
        }

        let subreddit = args[1]

        if(!args[1]) return message.reply("You need to define a subreddit")

        else if(maxRedditsToSendNum < 1) { maxRedditsToSendNum = 1; }

        else if(args[2])
        {
            if(args[2] < 1) { args[2] = 1; }
            else if(args[2] > maxRedditsToSendNum) { return message.reply(`You can only request ${maxRedditsToSendNum} messages`); }
            else
            {
                for (var i = 1; i <= args[2]; i++) {
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
        } 
        
        else
        {
            randomPuppy(subreddit).then(url => {
                fetch(url).then(async res => {
                    if(typeof res.body == undefined) return i--;
                    if(res.body)
                    {
                        await message.channel.send({
                            files: [{
                                attachment: res.body,
                                name: 'reddit.png'
                            }]
                        }).catch(err => console.log("Error - ", err.message));
                    }
                }).catch(err => console.log("Error - ", err.message));
            });
        }
        await message.channel.stopTyping(true);
    }
}
