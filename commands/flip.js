const { prefix, flipDeleteMessagesOnCommand, flipMessageDeleteDelay } = require("../config.json")

flipMessageDeleteDelayNum = parseInt(flipMessageDeleteDelay, 10)

module.exports = {
    config: {
            name: "coinflip",
            aliases: ["flip"],
            description: `Flips a coin, returns heads or tails
            Usage: ***${prefix}coinflip***
            Aliases: ***Flip***`
    },
    
    run: async(bot, message, args) =>
    {
        if(flipDeleteMessagesOnCommand == "true") 
        { 
            message.delete({timeout : flipMessageDeleteDelayNum * 1000}).catch(err => console.log("Error - ", err.message));
        }

            var chance = Math.floor(Math.random() * 2);
            
            if(chance === 0) 
            {
                message.reply("Your coin landed on Heads!");
            }
            else 
            {
                message.reply("Your coin landed on Tails!");
            }

        await message.channel.stopTyping(true);
    }
}