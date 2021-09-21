const { MessageEmbed } = require("discord.js");
const urban = require("urban");
const { stripIndents } = require("common-tags");
const { prefix, udDeleteMessagesOnCommand, udMessageDeleteDelay } = require("../config.json");


module.exports = {
    config: {
        name: "urbandictionary",
        aliases: ["ud"],
        description: `Looks for a word from urban dictionary
        Usage: ***${prefix} [search(s) / random (r)] ([word])***
        Aliases: ***ud***
        Example: ***${prefix}ud random***`
    },

    run: async(bot, message, args) => 
    {
        if(udDeleteMessagesOnCommand == "true") 
        { 
            message.delete({timeout : udMessageDeleteDelay * 1000}).catch(err => console.log("Error - ", err.message));
        }

        if(message.channel.nsfw == false && message.channel.type != "dm") 
            return message.reply("You can only use this command in nsfw channels and direct messages"); message.channel.stopTyping(true);
        
        if(args < 2 || !["search", "s", "random", "r"].includes(args[1].toLowerCase())) return message.reply(`Proper usage of this command
                 ${prefix}ud [search / random] ([word / phrase])`); message.channel.stopTyping(true);
        
        if(["random", "r"].includes(args[1].toLowerCase()) && args[2]) 
            return message.reply(`If you want to look for a specific word, use "search" instead of "random"`);

        if(["search", "s"].includes(args[1].toLowerCase()) && !args[2]) 
            return message.reply(`If you don't want to look for a specific word, use "random" instead of "search"`);

        let image = "https://lh3.googleusercontent.com/unQjigibyJQvru9rcCOX7UCqyByuf5-h_tLpA-9fYH93uqrRAnZ0J2IummiejMMhi5Ch";
        let search = args[2] ? urban(args.slice(2).join(" ")) : urban.random();

        try {
            search.first(res => {
                if(!res) return message.reply("No results found");
                let { word, definition, example, thumbs_up, thumbs_down, permalink, author } = res;

                let embed = new MessageEmbed()
                    .setColor([0, 255, 0])
                    .setAuthor(`Urban dictionary | ${word}`, image)
                    .setThumbnail(image)
                    .setDescription(stripIndents`**Definition:** ${definition || "No definition"}
                    **Example:** ${example || "No example"}
                    **Upvote:** ${thumbs_up || 0} 👍
                    **Downvote:** ${thumbs_down || 0} 👎
                    **Link:** [link to ${word}](${permalink || "https://www.urbandictionary.com/"})`)
                    .setFooter(`Written by ${author || "Unknown"}`);

                message.channel.send(embed)
            })
        } catch(err) {
            console.log(`Error - ${err.message}`);
        }
        
        message.channel.stopTyping(true);
    }
}