const { Client, Intents, Collection } = require("discord.js");
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGE_TYPING] });
const { readdir } = require("fs");
const path = require("path");
const botConfDir = path.join(__dirname, "botConfig", "defaults.json");
let botConf = require(botConfDir);

var fileName;
var commandsLoaded = 0;

bot.commands = new Collection();
bot.aliases = new Collection();

bot.on("ready", () => {
    console.log(bot.user.username + " is ready");
    bot.user.setActivity("!help", { type: "WATCHING" });
});

// Read commands folder contents to know how many commands there are and load them
readdir("./commands/", (err, files) => {
    if(err) console.log(err)

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0) { return console.log("Error - No commands found"); }

    console.log(`\nFound ${jsfile.length} commands to load`);

    jsfile.forEach((f, i) => {
        fileName = f.split(".").shift();
        try
        {
            let pull = require(`./commands/${f}`);
            console.log(`Loading command ${fileName}...`);
            bot.commands.set(pull.config.name.toLowerCase().split(" ").join(""), pull);
            pull.config.aliases.forEach(alias => {
                bot.aliases.set(alias, pull.config.name.toLowerCase());
            })
        } catch(err) { console.error(`\nCouldn't load command ${fileName} \n   >${err}\n`); commandsLoaded--; }
        commandsLoaded++;
    })
    if((jsfile.length - commandsLoaded) == 1) { console.log(`\n\n${commandsLoaded} commands loaded \n1 command failed to be loaded\n\n`); }
    else { console.log(`\n\n${commandsLoaded} commands loaded \n${jsfile.length - commandsLoaded} commands failed to be loaded\n\n`); }
})

// Bot commands
bot.on("messageCreate", async message => {
    if(message.author.type === "bot") return; // Ignore messages sent by bots
    
    let args = message.content.toLowerCase().split(" ");
    let cmd = args[0];

    if(!message.content.startsWith(botConf["prefix"])) return; // Ignore messages that don't start with the prefix

    let commandfile = bot.commands.get(cmd.toLowerCase().slice(botConf["prefix"].length)) || bot.commands.get(bot.aliases.get(cmd.toLowerCase().slice(botConf["prefix"].length)))
    if(commandfile)
    {
        console.log(args.join(" "))
        if(commandfile["config"]["name"] == "reload") {
            try {
                delete require.cache[require.resolve(botConfDir)]
                botConf = require(botConfDir)
                message.channel.send(`\`CONFIG\` reloaded.`)
            } catch(err) {
                console.error(`Error - ${err}`);
            }
        }
        try
        {
            message.channel.sendTyping();
            commandfile.run(bot, message, args);
        } catch(err) { console.error(`Error - ${err}`) }
    }
});

bot.login(process.env.DJS_TOKEN);
