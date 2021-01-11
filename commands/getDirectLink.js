const cheerio = require("cheerio");
const axios = require("axios");
const discord = require("discord.js")
const { MAIN_URL } = require("../config.json")

module.exports = {
	name: "getdirectlink",
	run: async (client, message, args) => {

		if(!args.length)
			return message.channel.send({embed: {description: ":wrong: | You have to give episode link", color: "RED"}})


		if (!args[0].includes("gogoanime.so"))
			return message.channel.send({embed: {description:":wrong: | We only support gogoanime.so links for now !", color: "RED"}});

		let msg = await message.channel.send({embed: {description: ":confounded: | Please wait while we scrap....", color: "YELLOW"}});

		axios({url: args[0]})
		.then(async function (res) {

			if(!res.data)
				return msg.edit({embed: {description: ":disappointed_relieved: | Something went wrong !", color: "RED"}});

			let $ = cheerio.load(res.data);
			let name = $('div.anime_video_body h1').text();
			let download = $("li.dowloads a").attr("href");
			let thumbnail = message.embeds[0].thumbnail.url

			let embed = new discord.MessageEmbed()
			.setTitle(name)
			.setColor("GREEN")
			.setFooter("Loading Download Link....")

			if(thumbnail) embed.setThumbnail(thumbnail)

	     try {
			let responce = await axios({url: download})
			$ = cheerio.load(responce.data);
			download = $("div.dowload a").attr("href");
			if(!download) {
				msg.delete();
			    return message.channel.send({embed: {description: ":disappointed_relieved: | Something went wrong !", color: "RED"}});
			}
			embed.setDescription(`Here is the Download link - [[Click Here](${download})]`);
			embed.addField(`Watch`, `[Watch Now](${MAIN_URL}/${download.replace("https://gogo-play.net/goto.php?url=", "")})`)
			return msg.edit(embed)
		} catch(err) {
			msg.delete();
			return message.channel.send({embed: {description: ":disappointed_relieved: | Something went wrong !", color: "RED"}});
		}
			
		})

	}
}