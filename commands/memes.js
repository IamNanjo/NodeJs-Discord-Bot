const { fetchFromReddit } = require("../fetchFromReddit")
const { MessageEmbed } = require("discord.js")
const { prefix, memeReddits, amountOfMemesToPost, maxMemesToPost, memesDeleteMessagesOnCommand, memesMessageDeleteDelay } = require("../config.json");

var amountOfMemesToPostNum = parseInt(amountOfMemesToPost, 10)
var maxMemesToPostNum = parseInt(maxMemesToPost, 10)
var memesMessageDeleteDelayNum = parseInt(memesMessageDeleteDelay, 10)

module.exports = { 
    config: {
        name: "memes",
        aliases: ["meme"],
        description: `Posts memes from reddit
        Subreddits: ***${memeReddits.join(", ")}***
        Usage: ***${prefix}memes***
        Aliases: ***Meme***
        Example: ***${prefix}memes***`
    },
    
    run: async(bot, message, args) =>
    {
        if(memesDeleteMessagesOnCommand == "true") 
        { 
            message.delete({timeout : memesMessageDeleteDelayNum * 1000}).catch(err => console.log("Error - ", err.message));
        }
        let subreddit = memeReddits[Math.floor(Math.random() * memeReddits.length)];
        
        await fetchFromReddit(subreddit).then(urls => {
            for(const [link, title] of Object.entries(urls)) {
                if(link.split(".").pop() == "jpg" || link.split(".").pop() == "jpeg" || link.split(".").pop() == "png") {
                    redditEmbed = new MessageEmbed()
                        .setColor([0, 255, 0])
                        .setAuthor(title)
                        .setImage(link)
                    message.channel.send(redditEmbed)
                }                    
            }
        })

        await message.channel.stopTyping(true);
    }
}
