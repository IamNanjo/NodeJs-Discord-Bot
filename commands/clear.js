const { prefix, maxDeletesPerClear, accessToClearCommand } = require("../config.json")

var maxDeletesPerClearNum = parseInt(maxDeletesPerClear, 10)

module.exports = {
    config : {
        name: "clear",
        aliases: ["purge", "delete", "del"],
        description: `Deletes 1 - ${maxDeletesPerClearNum} messages
        Usage: ***${prefix}clear [1 - ${maxDeletesPerClearNum}]***
        Aliases: ***Purge, Delete, Del***
        Example: ***${prefix}del ${Math.floor(maxDeletesPerClearNum / 2)}***`
    },

    run: async(bot, message, args) =>
    {
        if(message.channel.type == "dm") 
            return message.reply("You can't use this command in direct message chats."); message.channel.stopTyping(true);
            
        if(!message.member.hasPermission("MANAGE_MESSAGES") && !accessToClearCommand.includes(message.member.id) && accessToClearCommand.length > 0) {
            message.channel.stopTyping(true);
            return message.reply("You don't have the required permissions to use this command!");
        }
        if(!args[1]) {
            message.channel.stopTyping(true);
            return message.reply("Please provide an amount of messages to delete."); 
        }
        const number = Number(args[1])

        if(!Number.isInteger(number)) {
            message.channel.stopTyping(true);
            return message.reply("Number is not an integer");
        }
        if(isNaN(args[1])) {
            message.channel.stopTyping(true);
            return message.reply ("Not a number...");
        }
        if(number < 1) {
            message.channel.stopTyping(true);
            return message.reply ("You have to delete at least one message.");
        }
        if(number > maxDeletesPerClearNum) {
            message.channel.stopTyping(true);
            return message.reply (`You can only delete ${maxDeletesPerClearNum} messages at a time.`);
        }
        await message.delete().catch(err => console.log(`Error - ${err.message}`)); message.channel.stopTyping(true);
        await message.channel.bulkDelete(number).catch(err => console.log(`Error - ${err.message}`)); message.channel.stopTyping(true);
        
        await message.channel.stopTyping(true);
    }
}
