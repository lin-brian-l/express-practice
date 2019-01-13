var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	console.dir(req.user);
	const htmlInput = {
		title: 'Players',
		user: req.user
	}
	res.render('players/index', htmlInput);
});



module.exports = router;
