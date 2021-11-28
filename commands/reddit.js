const { MessageEmbed } = require("discord.js");
const { fetchFromReddit } = require("../fetchFromReddit.js")
const { prefix, redditDeleteMessagesOnCommand, redditMessageDeleteDelay } = require("../botConfig/defaults.json");

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
            message.delete({timeout : redditMessageDeleteDelayNum * 1000}).catch(err => console.error("Error - ", err));
        }

        let subreddit = args[1].toLowerCase()

        if(!subreddit) return message.reply("You need to define a subreddit")    

        else {
            await fetchFromReddit(subreddit, args[2] || undefined).then(urls => {
                for(const [imgLink, values] of Object.entries(urls)) {
                    let title = values["title"]
                    let postLink = ["https://reddit.com", values["link"]].join("")
                    let shortenedTitle = title
                    if(shortenedTitle.split("").length > 253) { // If more than 253 characters
                        shortenedTitle = shortenedTitle.split("").splice(0, 253)// Limit to 253 characters
                        shortenedTitle.push("...") // Add ... to the end of the title if it has been shortened
                        shortenedTitle = shortenedTitle.join("")
                    }

                    if(imgLink.split(".").pop() == "jpg" || imgLink.split(".").pop() == "jpeg" || imgLink.split(".").pop() == "png") {
                        redditEmbed = new MessageEmbed()
                            .setColor([0, 255, 0])
                            .setTitle(shortenedTitle)
                            .setDescription(postLink)
                            .setImage(imgLink)
                        message.channel.send({ embeds: [redditEmbed] })
                    }
                }
            })
        }
    }
}
