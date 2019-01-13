var express = require('express');
var router = express.Router();
const mongo = require('../config/mongo');
const playerHelpers = require('../helpers/players.helpers');

/* GET home page. */
router.get('/', async function (req, res, next) {
	try {
		const db = await mongo.connectToDB();
		let players = await db.collection('Players')
							  .find()
							  .sort({ rank: 1 })
							  .toArray();
		players = playerHelpers.formatPlayers(players);
		const htmlInput = {
			title: 'Players',
			user: req.user,
			players
		}
		res.render('players/index', htmlInput);
	} catch (error) {
		res.render('error', { message: error.message, error });
	}
});



module.exports = router;
