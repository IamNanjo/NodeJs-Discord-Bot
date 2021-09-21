const { MessageEmbed } = require("discord.js");
const { fetchFromReddit } = require("../fetchFromReddit.js")
const { prefix, redditDeleteMessagesOnCommand, redditMessageDeleteDelay, maxRedditsToSend } = require("../config.json")

var redditMessageDeleteDelayNum = parseInt(redditMessageDeleteDelay, 10)

module.exports = 
{
    config: {
        name: "reddit",
        aliases: ["r"],
        description: `Posts images from chosen subreddit
        Usage: ***${prefix}reddit [subreddit]***
        Aliases: ***r***
        Example: ***${prefix}r softwaregore***`
    },

    run: async(bot, message, args) =>
    {
        if(redditDeleteMessagesOnCommand == "true") 
        { 
            message.delete({timeout : redditMessageDeleteDelayNum * 1000}).catch(err => console.log("Error - ", err.message));
        }

        let subreddit = args[1].toLowerCase()

        if(!subreddit) return message.reply("You need to define a subreddit")    

        else {
            await fetchFromReddit(subreddit).then(urls => {
                for(const [link, title] of Object.entries(urls)) {
                    if(link.split(".").pop() == "jpg" || link.split(".").pop() == "jpeg" || link.split(".").pop() == "png") {
                        redditEmbed = new MessageEmbed()
                            .setColor([0, 255, 0])
                            .addField("Title", title)
                            .setImage(link)
                        message.channel.send(redditEmbed)
                    }                    
                }
            })
        }
        await message.channel.stopTyping(true);
    }
}
