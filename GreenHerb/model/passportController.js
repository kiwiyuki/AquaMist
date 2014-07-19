var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var setting = require('../setting');

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

module.exports = passport;
