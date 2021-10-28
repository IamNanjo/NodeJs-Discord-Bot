const { fetchFromReddit } = require("../fetchFromReddit")
const { MessageEmbed } = require("discord.js")
const { prefix, memeReddits, memesDeleteMessagesOnCommand, memesMessageDeleteDelay } = require("../config.json");

var memesMessageDeleteDelayNum = parseInt(memesMessageDeleteDelay, 10)

module.exports = { 
    config: {
        name: "memes",
        aliases: ["meme"],
        description: `Posts memes from reddit. Amount of memes can be limited with the first argument
        Subreddits: ***${memeReddits.join(", ")}***
        Usage: ***${prefix}memes (amount)***
        Aliases: ***Meme***
        Example: ***${prefix}memes 5***`
    },
    
    run: async(bot, message, args) =>
    {
        if(memesDeleteMessagesOnCommand == "true") 
        { 
            message.delete({timeout : memesMessageDeleteDelayNum * 1000}).catch(err => console.log("Error - ", err));
        }
        let subreddit = memeReddits[Math.floor(Math.random() * memeReddits.length)].toLowerCase();
        
        await fetchFromReddit(subreddit, args[1] || undefined).then(urls => {

            for(const [imgLink, values] of Object.entries(urls)) {
                let title = values["title"]
                let postLink = ["https://reddit.com", values["link"]].join("")
                if(title.split("").length > 253) { // If more than 253 characters
                    title = title.split("").splice(0, 253)// Limit to 253 characters
                    title.push("...")
                    title = title.join("")
                }

                if(imgLink.split(".").pop() == "jpg" || imgLink.split(".").pop() == "jpeg" || imgLink.split(".").pop() == "png") {
                    let redditEmbed = new MessageEmbed()
                        .setColor([0, 255, 0])
                        .setTitle(title)
                        .setDescription(postLink)
                        .setImage(imgLink)
                    message.channel.send(redditEmbed)
                }                    
            }
        })

        await message.channel.stopTyping(true)
    }
}
