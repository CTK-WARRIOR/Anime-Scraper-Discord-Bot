const { MessageEmbed } = require("discord.js")
module.exports = {
  name: "help",
  run: (client, message, args) => {

    let embed = new MessageEmbed()
    .setAuthor("Anime Scraper ⚒", client.user.displayAvatarURL())
    .setDescription("This bot is made by ________ and if you want to arrest him then you are good to go lmao :)")
    .addField("Commands", "`getdirectlink`, `search`")
    .addField("Last Words", "[It will help me alot if you join my server :)](https://withwin.in/dbd)")
    .setColor("GREEN")


    return message.channel.send(embed);

  }
}