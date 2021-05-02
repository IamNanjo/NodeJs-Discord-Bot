const { readdir } = require("fs");
const { prefix, reloadDeleteMessagesOnCommand, reloadMessageDeleteDelay, accessToReloadCommand } = require("../config.json");

var commandsReloaded = 0;

module.exports = 
{
    config: {
        name: "reload",
        aliases: [],
        description: `Reloads a chosen command or all commands (without arguments)
        Usage: ***${prefix}reload [command]***
        Aliases: ***None***
        Example: ***${prefix}reload all***`
    },

    run: async(bot, message, args) =>
    {
        if(!message.member.hasPermission("ADMINISTRATOR") && !accessToReloadCommand.includes(message.member.id) && accessToReloadCommand.length > 0)
            return message.reply("You don't have the required permissions to use this command")

        if(reloadDeleteMessagesOnCommand == "true") 
            { 
                message.delete({timeout : reloadMessageDeleteDelay * 1000}).catch(err => console.log("Error - ", err.message));
            }

        if(args[1])
        {
            let commandName = args[1].toLowerCase();
            try
            {
                delete require.cache[require.resolve(`./${commandName}.js`)];
                bot.commands.delete(commandName);
                let pull = require(`./${commandName}.js`);
                bot.commands.set(commandName, pull)
                message.channel.send(`\`${args[1].toUpperCase()}\` reloaded.`);
            } catch(err) {
                message.channel.send(`Error - ${err.message}`);
                console.log(err);
            }
        }
        else
        {
            message.channel.send(`Reloading commands...`)
            readdir(`./commands/`, (err, files) => {
                if(err) console.log(err);

                files.forEach(f => {
                    let commandName = f.split(".").shift();
                    try
                    {
                        delete require.cache[require.resolve(`./${f}`)];
                        bot.commands.delete(commandName);
                        let pull = require(`./${f}`)
                        bot.commands.set(commandName, pull)
                    } catch(e) {
                        message.channel.send(`Could not reload \`${commandName.toUpperCase()}\``);
                        console.log(`Error - ${e.message}`);
                        commandsReloaded--;
                    }
        
                    message.channel.send(`Reloading \`${commandName.toUpperCase()}...\``);
                    commandsReloaded++;
                })
                message.channel.send(`${commandsReloaded} commands succesfully reloaded`);
            })
        }
        message.channel.stopTyping(true);
    }
}
