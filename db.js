const mysql = require("mysql2/promise");

const db = mysql.createPool({
 host: "localhost",
 user: "root",
 password: "password",
 database: "flashcard_db",
});

(async function () {
 try {
   const connection = await db.getConnection();
   console.log('Database connection successful');
   connection.release();
 } catch (error) {
   console.error('Database connection failed:', error);
 }
})();

module.exports = db;