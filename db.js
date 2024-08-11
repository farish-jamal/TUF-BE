const mysql = require("mysql2/promise");

const db = mysql.createPool({
 host: process.env.DB_HOST,
 user: process.env.DB_USER,
 password: process.env.DB_PASSWORD,
 database: process.env.DB_DATABASE,
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