const { MAIN_URL, PREFIX, TOKEN } = require("./config.json")
const prefix = PREFIX;
const axios = require("axios");
const cheerio = require("cheerio");
const discord = require("discord.js")
const client = new discord.Client();
const {
	readdirSync
} = require("fs");
client.commands = new discord.Collection();

readdirSync("./commands/").forEach(file => {
	let command = require(`./commands/${file}`);
	client.commands.set(command.name, command)
})

client.on("ready", () => {
	console.log("----------- SYSTEM ON -----------")
  client.user.setActivity("c!help")
});

client.on("message", (message) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).trim().split(' ');
	const cmd = args.shift().toLowerCase();
	let command = client.commands.get(cmd);
	if (!command) return;

	command.run(client, message, args)
})

client.login(TOKEN);
