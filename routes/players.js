var express = require('express');
var router = express.Router();
const mongo = require('../config/mongo');
const mongodb = require('mongodb');
const playerHelpers = require('../helpers/players.helpers');
const redirectHelper = require('../helpers/redirect.helpers');

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

router.get('/new', redirectHelper.isLoggedIn, (req, res, next) => {
	const player = {
		name: "Justin Hallett",
		tag: "Wizzrobe",
		sponsor: "",
		rank: "7",
		unformattedMains: "Falcon"
	};
	const htmlInputs = {
		title: "New Player",
		player,
		errors: null
	}
	return res.render('players/new', htmlInputs);
});

router.get('/:id', redirectHelper.isLoggedIn, async (req, res, next) => {
	const playerId = req.params.id;
	try {
		const db = await mongo.connectToDB();
		let player = await db.collection('Players').findOne({ _id: mongodb.ObjectID(playerId) });
		player.unformattedMains = playerHelpers.formatMains(player.mains);
		delete player.mains;
		const htmlInputs = {
			title: "Edit Player",
			player,
			errors: null
		}
		res.render('players/edit', htmlInputs);
	} catch (error) {
		res.render('error', { message: error.message, error });
	}
})

router.post('/', redirectHelper.isLoggedIn, async (req, res, next) => {
	let player = req.body;
	player.rank = parseInt(player.rank);
	player.mains = playerHelpers.formatFormMains(player.unformattedMains);
	delete player.unformattedMains;
	try {
		const db = await mongo.connectToDB();
		await db.collection('Players').insertOne(player);
		return res.redirect('/players');
	} catch (error) {
		res.render('error', { message: error.message, error });
	}
});

router.put('/:id', redirectHelper.isLoggedIn, async (req, res, next) => {
	const playerId = req.params.id;
	let player = req.body;
	player.rank = parseInt(player.rank);
	player.mains = playerHelpers.formatFormMains(player.unformattedMains);
	delete player.unformattedMains;
	try {
		const db = await mongo.connectToDB();
		await db.collection('Players').update(
			{ _id: mongodb.ObjectID(playerId) },
			player,
			{ upsert: true }
		);
		return res.redirect('/players');
	} catch (error) {
		res.render('error', { message: error.message, error });
	}
})

module.exports = router;
