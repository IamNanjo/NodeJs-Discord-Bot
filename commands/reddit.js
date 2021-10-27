const { MessageEmbed } = require("discord.js");
const { fetchFromReddit } = require("../fetchFromReddit.js")
const { prefix, redditDeleteMessagesOnCommand, redditMessageDeleteDelay } = require("../config.json")

var redditMessageDeleteDelayNum = parseInt(redditMessageDeleteDelay, 10)

module.exports = 
{
    config: {
        name: "reddit",
        aliases: ["r"],
        description: `Posts images from chosen subreddit
        Usage: ***${prefix}reddit [subreddit] (amount)***
        Aliases: ***r***
        Example: ***${prefix}r softwaregore***`
    },

    run: async(bot, message, args) =>
    {
        if(redditDeleteMessagesOnCommand == "true") 
        { 
            message.delete({timeout : redditMessageDeleteDelayNum * 1000}).catch(err => console.log("Error - ", err));
        }

        let subreddit = args[1].toLowerCase()

        if(!subreddit) return message.reply("You need to define a subreddit")    

        else {
            await fetchFromReddit(subreddit, args[2] || undefined).then(urls => {
                for(const [link, title] of Object.entries(urls)) {
                    let shortenedTitle = title
                    if(shortenedTitle.split(" ").length > 10) { // If more than 10 words
                        shortenedTitle = shortenedTitle.split(" ").splice(0, 10).join(" ") // Limit to 10 words
                        shortenedTitle = shortenedTitle.split("")
                        shortenedTitle.push("...") // Add ... to the end of the title if it has been shortened
                        shortenedTitle = shortenedTitle.join("")
                    } else if(shortenedTitle.split("").length > 50) { // If more than 50 characters
                        shortenedTitle = shortenedTitle.split("").splice(0, 50)// Limit to 50 characters
                        shortenedTitle.push("...") // Add ... to the end of the title if it has been shortened
                        shortenedTitle = shortenedTitle.join("")
                    }

                    if(link.split(".").pop() == "jpg" || link.split(".").pop() == "jpeg" || link.split(".").pop() == "png") {
                        redditEmbed = new MessageEmbed()
                            .setColor([0, 255, 0])
                            .setTitle(shortenedTitle)
                            .setImage(link)
                        message.channel.send(redditEmbed)
                    }
                }
            })
        }
        await message.channel.stopTyping(true);
    }
}
