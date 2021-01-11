const cheerio = require("cheerio");
const axios = require("axios");
const discord = require("discord.js")
const { MAIN_URL } = require("../config.json")

module.exports = {
	name: "search",
	run: async (client, message, args) => {

		if (!args.length) return message.channel.send({
			embed: {
				"description": "Anime name is required!",
				"color": "RED"
			}
		})

		let searchString = args.join("%20")

		let embed = new discord.MessageEmbed()
			.setAuthor("Please wait....", client.user.displayAvatarURL())


		let msg = await message.channel.send(embed)


		axios({
				url: "https://gogoanime.so//search.html?keyword=" + searchString
			})
			.then(async function(res) {

				let $ = cheerio.load(res.data)
				let cards = {
					title: [],
					link: []
				}

				$('li p.name a').each(function(i, elem) {
					let title = $(this).text()
					let link = $(this).attr('href')

					if (title && link) {
						cards.title.push(title)
						cards.link.push(link)
					}
				})


				if (!cards.title.length) {
					embed
						.setAuthor("Unable to Find Anime with this name :C", client.user.displayAvatarURL())
						.setColor("RED")

					return msg.edit(embed)
				}

				let description = []


				cards.title.forEach((x, i) => {
					if (i >= 10) return;
					x = `[ ${i+1} ] : [` + x + `](https://gogoanime.so${cards.link[i]})`
					description.push(x)
				})



				embed
					.setAuthor("Reply with your Anime Number", client.user.displayAvatarURL())
					.setColor("GREEN")
					.setDescription(description.join("\n"));


				msg.edit(embed)

				let responses = await message.channel.awaitMessages(
					msg => msg.author.id === message.author.id, {
						time: 300000,
						max: 1
					}
				);
				let repMsg = responses.first();

				if (!repMsg) {
					return message.channel.send({
						embed: {
							"description": "Cancelled the process due to no activity!",
							"color": "RED"
						}
					})
				}

				if (isNaN(repMsg.content)) {
					return message.channel.send({
						embed: {
							"description": "Cancelled the process because of invalid number!",
							"color": "RED"
						}
					})
				}


				if (parseInt(repMsg.content) > 10 || parseInt(repMsg.content) <= 0) {
					return message.channel.send({
						embed: {
							"description": "Cancelled the process because of invalid number!",
							"color": "RED"
						}
					})

				}

				let target = cards.link[parseInt(repMsg.content) - 1]

				if (!target) {
					return message.channel.send({
						embed: {
							"description": "Something went wrong so we have to cancel the process!",
							"color": "RED"
						}
					})
				}

				res = await axios({
					url: "https://gogoanime.so" + target
				})
				$ = cheerio.load(res.data)
				let anime_title = $('div.anime_info_body_bg h1').text()
				let anime_image = $('div.anime_info_body_bg img').attr('src')
				let anime_episode = $('a.active').text().replace('0-', '');


				if (!anime_title || !anime_image || !anime_episode) {
					return message.channel.send({
						embed: {
							"description": "Something went wrong so we have to cancel the process!",
							"color": "RED"
						}
					})
				}


				embed
					.setThumbnail(anime_image)
					.setAuthor(anime_title, client.user.displayAvatarURL())
					.setDescription('Total Episode available in this anime are **' + anime_episode + '** , Reply with episode number that you want to watch!')

				repMsg.delete()
				msg.edit(embed)

				responses = await message.channel.awaitMessages(
					msg => msg.author.id === message.author.id, {
						time: 300000,
						max: 1
					}
				);

				repMsg = responses.first();

				if (!repMsg) {
					return message.channel.send({
						embed: {
							"description": "Cancelled the process due to no activity!",
							"color": "RED"
						}
					})
				}

				if (isNaN(repMsg.content)) {
					return message.channel.send({
						embed: {
							"description": "Cancelled the process because of invalid number!",
							"color": "RED"
						}
					})
				}


				if (parseInt(repMsg.content) > anime_episode || parseInt(repMsg.content) <= 0) {
					return message.channel.send({
						embed: {
							"description": "Given number of episode is not available :/",
							"color": "RED"
						}
					})

				}

				let episode_link = "https://gogoanime.so" + target.replace('category/', '') + "-episode-" + repMsg.content.trim()
				


				        res = await axios({url: episode_link})
			
						$ = cheerio.load(res.data);
						let anime_download_link = $("li.dowloads a").attr("href");

							res = await axios({
								url: anime_download_link
							})
							$ = cheerio.load(res.data);
							anime_download_link = $("div.dowload a").attr("href");
					


				if (!anime_download_link) {
					return message.channel.send({
						embed: {
							"description": "Unable to get the download link :/",
							"color": "RED"
						}
					})
				}


				embed
				.setDescription(`Download link of Episode **${repMsg.content.trim()}** - [[Click Here](${anime_download_link})]`)
				.addField("Watch",  `[Watch Now](${MAIN_URL}/${anime_download_link.replace("https://gogo-play.net/goto.php?url=", "")})`)


                repMsg.delete()
				return msg.edit(embed)


			}).catch(err => {
				console.log(err)
				return message.channel.send({
					embed: {
						"description": "Something went wrong!",
						"color": "RED"
					}
				})
			})

	}
}