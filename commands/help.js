let config = require(`../config.json`);

module.exports = {
	name: 'help',
	description: 'Show a list of all commands.',
	usage: '[command name]',
	execute(message, args) {
		const cmd = [];
		const { commands } = message.client;

		if (!args.length) {
			cmd.push('Here\'s the list of all commands:');
			cmd.push(` > ` + commands.map(command => command.name).join(`\n > `));
			cmd.push(`\nYou can send \`` + config.prefix + `help [command name]\` to get info on a specific command!`);

			return message.channel.send(cmd, { split: true });
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('that\'s not a valid command!');
		}

		cmd.push(`**Name:** ${command.name}`);

		if (command.description) cmd.push(`**Description:** ${command.description}`);
		if (command.usage) cmd.push(`**Usage:** ` + config.prefix + `${command.name} ${command.usage}`);

		message.channel.send(cmd, { split: true });

	}
};