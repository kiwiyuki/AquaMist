var express = require('express');
var router = express.Router();
var passport = require('../model/passportController');
var db = require('../model/sqlite3Controller');

router.use(passport.initialize());
router.use(passport.session());

router.get('/', passport.authenticate('twitter'));
router.get('/auth/twitter/callback', passport.authenticate('twitter', {
	failureRedirect: '/'
}) ,function (req, res) {
	req.session.user = req.session.passport.user;
	var user = req.session.user;
	db.all("select id from users where id = $id",{ $id: user.id }, function (err, rows) {
		if(!err) {
			if(rows.length === 0) {
				// ユーザーを作成
			} else if ( rows.length === 1) {
				// アカウントログイン、アップデート
			}
		} else {
			// error 処理
			res.render('error',{
				message: err.message,
				error: err
				});
		}
	});
	res.redirect('/user');
});

module.exports = router;
