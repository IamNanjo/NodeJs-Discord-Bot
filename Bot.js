const { Client, Collection } = require("discord.js");
const bot = new Client();
const { readdir } = require("fs");
let botConf = require("./botConfig/defaults.json");

var fileName;
var commandsLoaded = 0;

bot.commands = new Collection();
bot.aliases = new Collection();


bot.on("ready", () => {
    console.log(bot.user.username + " is ready");
    bot.user.setActivity("!help", { type: "WATCHING" })
        .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
        .catch(e => console.log("Error - ", e.message))
});

// Read commands folder contents to know how many commands there are and load them
readdir("./commands/", (err, files) => {
    if(err) console.log(err)

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0) { return console.log("Error - No commands found"); }

    console.log(`\nFound ${jsfile.length} commands to load`)

    jsfile.forEach((f, i) => {
        fileName = f.split(".").shift();
        try
        {
            let pull = require(`./commands/${f}`);
            console.log(`Loading command ${fileName}...`)
            bot.commands.set(pull.config.name.toLowerCase().split(" ").join(""), pull);
            pull.config.aliases.forEach(alias => {
                bot.aliases.set(alias, pull.config.name.toLowerCase())
            })
        } catch(err) { console.log(`\nCouldn't load command ${fileName} \n   >${err}\n`); commandsLoaded--; }
        commandsLoaded++;
    })
    if((jsfile.length - commandsLoaded) == 1) { console.log(`\n\n${commandsLoaded} commands loaded \n1 command failed to be loaded\n\n`) }
    else { console.log(`\n\n${commandsLoaded} commands loaded \n${jsfile.length - commandsLoaded} commands failed to be loaded\n\n`) }
})

// Bot is ready
bot.on("message", async message => {
    if(message.author.type === "bot") return;
    
    let args = message.content.toLowerCase().split(" ");
    let cmd = args[0];

    if(!message.content.startsWith(botConf["prefix"])) return; // Ignore messages that don't start with the prefix

    let commandfile = bot.commands.get(cmd.toLowerCase().slice(botConf["prefix"].length)) || bot.commands.get(bot.aliases.get(cmd.toLowerCase().slice(botConf["prefix"].length)))
    if(commandfile) 
    {
        if(commandfile["config"]["name"] == "reload") {
            try {
                delete require.cache[require.resolve("./config.json")]
                botConf = require("./config.json")
                message.channel.send(`\`CONFIG\` reloaded.`)
            } catch(err) {
                console.log(`Error - ${err}`);
            }
        }
        try
        {
            message.channel.startTyping();
            commandfile.run(bot, message, args);
        } catch(err) { console.log(`Error - ${err}`) }
    }
});

bot.login(process.env.DJS_TOKEN);
