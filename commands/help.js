const { MessageEmbed } = require("discord.js");
const { prefix, helpDuration, helpDeleteMessagesOnCommand, helpMessageDeleteDelay } = require("../config.json");
const { readdirSync } = require("fs");

let helpDurationNum = parseInt(helpDuration, 10)
let helpMessageDeleteDelayNum = parseInt(helpMessageDeleteDelay, 10)

let cmdListWithHelpCmd = readdirSync(__dirname);

let cmdList = cmdListWithHelpCmd.filter(function(f) {
    return f != "help.js";
})

cmdList.sort();
let reqName;

let helpHelp;


module.exports = 
{
    config: {
        name: "help",
        aliases: ["?"]
    },

    run: async(bot, message, args) => {
        if(helpDeleteMessagesOnCommand == "true") 
        { 
            message.delete({timeout : helpMessageDeleteDelayNum * 1000}).catch(err => console.log("Error - ", err.message));
        }

        if(args[1]) {
            helpEmbed = new MessageEmbed()
                .setColor([0, 255, 0])
                .setAuthor("Help")
                .setDescription(`Bot prefix is ${prefix}\nAliases are just different names for the same command\n\n\n`)
            
            if(args[1].toLowerCase() == "help") {
                helpEmbed.addField(helpHelp.name, helpHelp.description)
            } else {
                if(cmdList.includes(`${args[1]}.js`)) {
                    try {
                        reqName = require(`./${args[1]}.js`);
                        helpEmbed.addField(reqName.config.name, reqName.config.description);
                    } catch(err) { return console.log(err.message) }
                } else { return message.reply(`Command ${args[1]} not found`) }
            }
        }
        else if(!args[1]) {
            helpEmbed = new MessageEmbed()
                .setColor([0, 255, 0])
                .setAuthor("Help")
                .setDescription(`Bot prefix is ${prefix}\nAliases are just different names for the same command\n\n Commands: \n\n\n`)
                .addField(helpHelp.name, helpHelp.description + "\n");
            
            cmdList.forEach(c => {
                reqName = require(`./${c}`);

                try { 
                    helpEmbed.addField(reqName.config.name, reqName.config.description); 
                } catch(err) { return console.log(err.message); } 
            })
        }

        if (!helpDurationNum <= 0) {
            message.channel.send(helpEmbed)
                .then(msg => { msg.delete({ timeout: helpDurationNum * 1000 }) }).catch(err => console.log("Error - ", err.message))
        } else message.channel.send(helpEmbed).catch(err => console.log("Error - ", err.message))

        await message.channel.stopTyping(true);
    }
}

if(!helpDurationNum <= 0)
{
    helpHelp = {
        name: "help",
        aliases: ["?"],
        description: `Displays this message. Deletes the help message automatically ${helpDurationNum} seconds after sending it.
        Usage: ***${prefix}help***
        Aliases: ***?***
        Example: ***${prefix}?***`
    }
} else {
    helpHelp = {
        name: "help",
        aliases: ["?"],
        description: `Displays this message.
        Usage: ***${prefix}help***
        Aliases: ***?***
        Example: ***${prefix}?***`
    }

}