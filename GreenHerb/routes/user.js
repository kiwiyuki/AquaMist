var express = require('express');
var router = express.Router();
var util = require('../util');

/* GET users listing. */
router.get('/', util.ensureAuthenticated, function(req, res) {
	res.render('user',{user: req.session.user, date: req.session.date });
});

module.exports = router;
