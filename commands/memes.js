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

            for(const [link, title] of Object.entries(urls)) {
                let shortenedTitle = title
                if(shortenedTitle.split(" ").length > 20) { // If more than 20 words
                    console.log("More than 10 words")
                    shortenedTitle = shortenedTitle.split(" ").splice(0, 20).join(" ") // Limit to 20 words
                    shortenedTitle = shortenedTitle.split("")
                    shortenedTitle.push("...")
                    shortenedTitle = shortenedTitle.join("")
                } else if(shortenedTitle.split("").length > 100) { // If more than 100 characters
                    console.log("More than 100 characters")
                    shortenedTitle = shortenedTitle.split("").splice(0, 100)// Limit to 100 characters
                    shortenedTitle.push("...")
                    shortenedTitle = shortenedTitle.join("")
                }

                if(link.split(".").pop() == "jpg" || link.split(".").pop() == "jpeg" || link.split(".").pop() == "png") {
                    let redditEmbed = new MessageEmbed()
                        .setColor([0, 255, 0])
                        .setTitle(shortenedTitle)
                        .setImage(link)
                    message.channel.send(redditEmbed)
                }                    
            }
        })

        await message.channel.stopTyping(true)
    }
}
