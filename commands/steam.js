const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const { stripIndents } = require("common-tags");
const dateFormat = require("dateformat");
const { prefix, steamDeleteMessagesOnCommand, steamMessageDeleteDelay } = require("../config.json");


module.exports = {
    config: {
        name: "steam",
        aliases: [],
        description: `Get steam stats of a user
        Usage: ***${prefix}steam [username]***
        Aliases: ***None***`
    },

    run: async(bot, message, args) =>
    {
        if(steamDeleteMessagesOnCommand == "true") 
        { 
            message.delete({timeout : steamMessageDeleteDelay * 1000}).catch(err => console.log("Error - ", err.message));
        }

        const token = "512429077A3013EFED54AC54B457722B";
        
        if(!args[1]) return message.reply(`Proper usage of this command:
            ${prefix}steam [user]`); message.channel.stopTyping(true);
        let justArgs = args.join(" ").slice(7);

        const url = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${token}&vanityurl=${justArgs}`;
        
        fetch(url).then(res => res.json()).then(body => {
            if(body.response.success === 42) 
                return message.reply("User not found");

            const id = body.response.steamid;
            const summaries = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${token}&steamids=${id}`;
            const bans = `http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${token}&steamids=${id}`;
            const state = ["Offline", "Online", "Busy", "Away", "Snooze", "Looking to trade", "Looking to play"];

            fetch(summaries).then(res => res.json()).then(body => {
                if(!body.response) return message.reply("User not found");

                const { personaname, avatarfull, realname, personastate, loccountrycode, profileurl, timecreated } = body.response.players[0];

                fetch(bans).then(res => res.json()).then(body => {
                    if(!body.players) return message.reply("User not found");

                    const { NumberOfVACBans, NumberOfGameBans } = body.players[0];

                    let embed = new MessageEmbed()
                        .setColor([0, 255, 0])
                        .setAuthor(`Steam services | ${personaname}`, avatarfull)
                        .setThumbnail(avatarfull)
                        .setDescription(stripIndents`**Real Name:** ${realname || "Unknown"}
                        **Status:** ${state[personastate]}
                        **Country:** :flag_${loccountrycode ? loccountrycode.toLowerCase() : "white"}:
                        **Account created at:** ${dateFormat(timecreated * 1000, "d/mm/yyyy")}
                        **Bans:** Vac: ${NumberOfVACBans}, Game: ${NumberOfGameBans}
                        **Link:** [link to profile](${profileurl})`)
                        .setTimestamp();
                    
                    message.channel.send(embed);
                })
            })
        })
    }
}