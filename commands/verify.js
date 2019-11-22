let config = require(`../config.json`);
let pool = require(`../functions/db.js`);
const request = require('request');

module.exports = {
    name: 'verify',
    description: 'Verify your league account.',
    execute(message, args) {
        let region = args[1];
        let name = args[0];

        let rg = "eun1";
        if (region === "eune") {
            let rg = "eun1";
        } else if (region === "euw") {
            let rg = "euw1";
        } else {
            message.channel.send("Not a valid region. Usage: " + config.prefix + "verify <username> <region>");
            return;
        }

        request('https://' + rg + '.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + name + '?api_key=' + config.key, function (error, reponse, body) {
            if (error) {
                console.log('error: ', error);
            }
            let ress = JSON.parse(body);
            request('https://' + rg + '.api.riotgames.com/lol/platform/v4/third-party-code/by-summoner/' + ress.id + '?api_key=' + config.key, function (err, res, b) {
                if (err) {
                    console.log('error: ', err);
                }
                let code = b.substring(1, b.length - 1);
                if (code === message.author.id) {
                    pool.query('INSERT INTO users (id, name, summ, rg) VALUES (\'' + message.author.id + '\', \'' + ress.name + '\', \'' + ress.accountId + '\', \'' + rg + '\') ON DUPLICATE KEY UPDATE summ = \'' + ress.accountId + '\', name = \'' + ress.name + '\', rg = \'' + rg + '\'', function (e, r, f) {
                        if (e) throw new Error(e);
                    });
                    message.channel.send("Verification successful!")
                } else {
                    message.channel.send("Verification failed! Check for typos!")
                }
            });
        });
    }
};