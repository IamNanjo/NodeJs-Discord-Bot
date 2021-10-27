const { prefix, maxDeletesPerClear, accessToClearCommand } = require("../config.json")

module.exports = {
    config: {
            name: "config",
            aliases: ["conf"],
            description: `Shows or edits bot configuration
            Usage: ***${prefix}config ***
            Aliases: ***conf***
            Example: ***${prefix}conf show prefix***`
    },
    
    run: async(bot, message, args) =>
    {
        if(!message.member.hasPermission("ADMINISTRATOR") && !botConf["accessToConfig"].includes(message.member.id))
            return message.reply("You don't have the required permissions to use this command")
        
        if(!args[1]) // If command is missing the first argument. 
            return bot.commands.get("help").run(bot, message, ["!help", "config"]) // Use !help command to show how to use this command
    }
}