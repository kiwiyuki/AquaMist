var sqlite3 = require('sqlite3').verbose();
var path = require('path');
// TODO
// Databese で相対パスが使えない? 要検証
var db = new sqlite3.Database(path.resolve('model/db/db.sqlite3'));

/**
* table
*   |- user
* 		|- id text
* 		|- username text
* 		|- displayName text
* 		|- photos object
* 		|- created date
* 		|- last login date
*/

// もし、users tableが無い場合作成する
db.run("create table if not exists users (id text, username text, displayName text, photos, created, lastLogin)");
module.exports = db;