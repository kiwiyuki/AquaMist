var sqlite3 = require('sqlite3').verbose();
var path = require('path');
// TODO
// Databese で相対パスが使えない? 要検証
var db = new sqlite3.Database(path.resolve('model/db/db.sqlite3'));

/**
* table
* 	|- users
* 	|	|- id text
* 	|	|- username text
* 	|	|- displayName text
* 	|	|- photos text
* 	|	|- created date
* 	|	|- lastLogin date
* 	|	 - nthLogin number
* 	|
* 	|- game
* 		|- id text
* 		|- score
* 		|- color
*
*/

// もし、users tableが無い場合作成する
db.run("create table if not exists users (id text, username text, displayName text, photos, created, lastLogin, nthLogin)");
db.run("create table if not exists game  (id text, score, color)");
module.exports = db;