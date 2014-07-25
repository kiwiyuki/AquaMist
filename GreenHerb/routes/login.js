var express = require('express');
var router = express.Router();
// var passport = require('../model/passportController');
var db = require('../model/sqlite3Controller');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var setting = require('../setting');
router.use(passport.initialize());
router.use(passport.session());

passport.use(new TwitterStrategy({
	consumerKey: setting.twitter.consumerKey,
	consumerSecret: setting.twitter.consumerSecret,
	callbackURL: setting.twitter.callbackURL
},function (token, tokenSecret, profile, done) {
	done(null, profile);
}));

passport.serializeUser(function (user, done) {
	done(null, user);
});
passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

router.get('/', passport.authenticate('twitter'));
router.get('/auth/twitter/callback', passport.authenticate('twitter', {
	failureRedirect: '/'
}) ,function (req, res) {
	req.session.user = req.session.passport.user;
// 	var user = req.session.user;
	var time = Date();
	req.session.date = time;
	db.all("select id from users where id = $id",{ $id: req.session.user.id }, function (err, rows) {
		if(!err) {
			if(rows.length === 0) {
				// ユーザーを作成
// 				db.run("insert into users (id,username,displayName,photos,created,lastLogin, nthLogin) values ($id,$un,$dN,$p,$c,$lL,$nL)", {
// 				$id:user.id,
// 				$un:user.username,
// 				$dN:user.displayName,
// 				$p:user.photos[0].value,
// 				$c:time,
// 				$lL:time,
// 				$nL: 1
// 				});
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
// 	res.render('user',{user : req.session.user, date: time});
});

module.exports = router;
