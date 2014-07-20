var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db/db.sqlite3');

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

module.exports = db;