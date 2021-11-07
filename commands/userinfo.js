const Discord = require("discord.js");
const moment = require("moment");
const { prefix, userinfoDeleteMessagesOnCommand, userinfoMessageDeleteDelay } = require("../botConfig/defaults.json");


module.exports = 
{
    config: {
        name: "UserInfo",
        aliases: ["ui"],
        description: `Shows information about the mentioned user
        Usage: ***${prefix}userinfo @member***
        Aliases: ***ui***
        Example: ***${prefix}ui @member***`
    },

    run: async(bot, message, args) =>
    {
        if(message.channel.type == "dm") return message.reply("You can't use this command in direct message chats.");

        if(!args[1]) return message.reply(`You have to mention the user that you want information of \n     !ui @member`)

        if(userinfoDeleteMessagesOnCommand == "true")
            { 
                message.delete({timeout : userinfoMessageDeleteDelay * 1000}).catch(err => console.log("Error - ", err));
            }
        
        let member = message.mentions.members.first();

        let userInfoEmbed = new Discord.MessageEmbed()
            .setColor("#00ff00")
            .setThumbnail(member.user.avatarURL())
            .setAuthor(`User Info Requested by : ${message.author.tag}`)
            .setTitle(`Information about ${member.user.tag}`)
            .addField("User's ID", member.id)
            .addField("User was created on : ", `${moment.utc(member.user.createdAt).format("dddd, MMMM Do YYYY, HH:mm:ss")} UTC / GMT`)
            .addField("User joined this server on : ", `${moment.utc(member.joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss")} UTC / GMT`)
            .setTimestamp()

        message.channel.send(userInfoEmbed);

        await message.channel.stopTyping(true);
    }
}
