let config = require(`../config.json`);
let pool = require(`../functions/db.js`);
let champions = require(`../data/champions.json`);
const request = require('request');

module.exports = {
	name: 'games',
	description: 'See how many games you\'ve played.',
	execute(message, args) {
		pool.query('SELECT * FROM users WHERE id = \'' + message.author.id + '\'', function (error, response, f) {
			if (error) throw new Error(error);
			let region = response[0].rg;
			let id = response[0].summ;

			var add = '';
			if (args[0]) {
				let temp = args[0].toLowerCase();
				var add = "&champion=" + champions.data[temp].key;
			}
			request('https://' + region + '.api.riotgames.com/lol/match/v4/matchlists/by-account/' + id  + '?api_key=' + config.key + add, function (error, reponse, body) {
				let json = JSON.parse(body);
				if (json.totalGames > json.endIndex) {
					let i = json.totalGames - 1;
					request('https://' + region + '.api.riotgames.com/lol/match/v4/matchlists/by-account/' + id + '?beginIndex=' + i  + '&api_key=' + config.key + add, function (e, r, b) {
						let j = JSON.parse(b);
						message.channel.send("<@" + message.author.id + "> You have played " + j.totalGames + " games in the last 2 years")
						return;
					});
				} else {
					message.channel.send("<@" + message.author.id + "> You have played " + json.totalGames + " games in the last 2 years")
					return;
				}
			});
		});
	}
};