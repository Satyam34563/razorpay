const mysql = require("mysql2");

// Create a connection
const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "dindayal65",
  database: "razorpay",
  waitForConnections: true,
  connectionLimit: 10, // Adjust based on your requirements
  queueLimit: 0
});

// connection.end();
module.exports=connection;