var express = require('express');
var router = express.Router();
var passport = require('../model/passportController');

router.use(passport.initialize());
router.use(passport.session());

router.get('/', passport.authenticate('twitter'));
router.get('/auth/twitter/callback', passport.authenticate('twitter', {
	failureRedirect: '/'
}) ,function (req, res) {
	req.session.user = req.session.passport.user;
	res.redirect('/user');
});

module.exports = router;
