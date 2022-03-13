const { readdir, writeFileSync } = require("fs");
const path = require("path");
const botConfDir = path.join(__dirname, "..", "botConfig", "defaults.json");
let botConf = require(botConfDir);

var commandsReloaded = 0;


module.exports = 
{
    config: {
        name: "reload",
        aliases: [],
        description: `Reloads a chosen command or all commands (without arguments)
        Usage: ***${botConf.prefix}reload [command]***
        Aliases: ***None***
        Example: ***${botConf.prefix}reload reddit***`
    },

    run: (bot, message, args) =>
    {
        if(!message.member.permissions.has("ADMINISTRATOR") && !botConf.accessToReloadCommand.includes(message.member.id))
            return message.reply("You don't have the required permissions to use this command")

        if(botConf.reloadDeleteMessagesOnCommand == "true") { 
            message.delete({timeout : botConf.reloadMessageDeleteDelay * 1000}).catch(err => console.error("Error - ", err));
        }
        
        botConf = require(botConfDir)

        if(args[1])
        {
            let commandName = args[1].toLowerCase();

            if(commandName == "reddit") {
                for(const key in botConf["after"]) {
                    if(!botConf["memeReddits"].includes(key)) {
                        botConf["after"][key] = ""
                    }
                }
                writeFileSync(botConfDir, JSON.stringify(botConf, null, 2))

                try
                {
                    delete require.cache[require.resolve(`./${commandName}.js`)]
                    bot.commands.delete(commandName)
                    let pull = require(`./${commandName}.js`)
                    bot.commands.set(commandName, pull)
                    message.channel.send(`\`${args[1].toUpperCase()}\` reloaded.`)
                } catch(err) {
                    console.error(`Error - ${err}`);
                }
            }
            else if(commandName == "memes") {
                for(const key in botConf["after"]) {
                    if(botConf["memeReddits"].includes(key)) {
                        botConf["after"][key] = ""
                    }
                }
                writeFileSync(botConfDir, JSON.stringify(botConf, null, 2))

                try
                {
                    delete require.cache[require.resolve(`./${commandName}.js`)];
                    bot.commands.delete(commandName);
                    let pull = require(`./${commandName}.js`);
                    bot.commands.set(commandName, pull)
                    message.channel.send(`\`${args[1].toUpperCase()}\` reloaded.`);
                } catch(err) {
                    console.error(`Error - ${err}`);
                }
            }
            else {
                try
                {
                    delete require.cache[require.resolve(`./${commandName}.js`)];
                    bot.commands.delete(commandName);
                    let pull = require(`./${commandName}.js`);
                    bot.commands.set(commandName, pull)
                    message.channel.send(`\`${args[1].toUpperCase()}\` reloaded.`);
                } catch(err) {
                    console.error(`Error - ${err}`);
                }
            }
        }
        else {
            message.channel.send(`Reloading commands...`)

            for(const key in botConf["after"]) {
                botConf["after"][key] = ""
            }
            writeFileSync(botConfDir, JSON.stringify(botConf, null, 2))

            readdir(__dirname, (err, files) => {
                if(err) console.log(err);

                files.forEach(f => {
                    let commandName = f.split(".").shift();
                    try
                    {
                        delete require.cache[require.resolve(`./${f}`)];
                        bot.commands.delete(commandName);
                        let pull = require(`./${f}`)
                        bot.commands.set(commandName, pull)
                    } catch(err) {
                        message.channel.send(`Could not reload \`${commandName.toUpperCase()}\``);
                        console.error(`Error - ${err.message}`);
                        commandsReloaded--;
                    }
        
                    message.channel.send(`Reloading \`${commandName.toUpperCase()}...\``);
                    commandsReloaded++;
                })
                message.channel.send(`${commandsReloaded} commands succesfully reloaded`);
            })
        }
    }
}
