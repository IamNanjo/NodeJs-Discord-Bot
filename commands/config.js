const botConf = require("../botConfig/defaults.json")

module.exports = {
    config: {
            name: "config",
            aliases: ["conf"],
            description: `Shows or edits bot configuration
            Usage: ***${botConf["prefix"]}config [show / edit] <all / setting> (<new value>)***
            Aliases: ***conf***
            Example: ***${botConf["prefix"]}conf edit prefix ?***`
    },
    
    run: async(bot, message, args) =>
    {
        if(!message.member.hasPermission("ADMINISTRATOR") && !botConf["accessToConfig"].includes(message.member.id))
            return message.reply("You don't have the required permissions to use this command")
        
        if(!args[1] || !args[2]) { // If command is missing the first or second argument. 
            return bot.commands.get("help").run(bot, message, ["!help", "config"]) // Use !help command to show user how to use this command
        }
        else if(args[1].toLowerCase() == "show") { // READ
            if(args[2].toLowerCase() == "all") {

            } 
            else {

            }
        } 
        else if(args[1].toLowerCase() == "edit" && args[3]) { // WRITE
            message.channel.send(`Editing setting \`${args[2]}\` from \`${botConf[args[2]]}\` to \`${args[3]}\``)
        } 
        else {
            return bot.commands.get("help").run(bot, message, ["!help", "config"]) // Use !help command to show user how to use this command
        }

        await message.channel.stopTyping(true)
    }
}