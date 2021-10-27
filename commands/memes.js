const { fetchFromReddit } = require("../fetchFromReddit")
const { MessageEmbed } = require("discord.js")
const { prefix, memeReddits, memesDeleteMessagesOnCommand, memesMessageDeleteDelay } = require("../config.json");

var memesMessageDeleteDelayNum = parseInt(memesMessageDeleteDelay, 10)

module.exports = { 
    config: {
        name: "memes",
        aliases: ["meme"],
        description: `Posts memes from reddit. Amount of memes can be limited with the 2nd argument
        Subreddits: ***${memeReddits.join(", ")}***
        Usage: ***${prefix}memes amount***
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
        
        await fetchFromReddit(subreddit).then(urls => {
            let urlsCut = urls

            if(args[2] && !isNaN(args[2])) {
                urlsCut.splice(0, args[2])
            }

            for(const [link, title] of Object.entries(urlsCut)) {
                let shortenedTitle = title
                if(shortenedTitle.split(" ").length > 5) {
                    console.log("More than 10 words")
                    shortenedTitle = shortenedTitle.split(" ").splice(0, 5) // Limit to 10 words
                    shortenedTitle.push("...") 
                    shortenedTitle = shortenedTitle.join(" ")
                } else if(shortenedTitle.split("").length > 100) { 
                    console.log("More than 100 characters")
                    shortenedTitle = shortenedTitle.split("").splice(0, 50)// Limit to 50 characters
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

        await message.channel.stopTyping(true);
    }
}
