var util = {
	// loginしているかどうかの判定をする関数
	// loginしていない場合: 401
	// loginしている場合  : next()、実際の処理をする。
	// userページに使ってるので参照
	ensureAuthenticated : function (req, res, next) {
		if(!req.session.passport) {
			res.send(401);
		} else {
			next();
		}
	}
};

module.exports = util;
