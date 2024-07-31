const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'mysql-nttoan.h.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_ZWiBnrk9nUxlHlKfC8S',
  database: 'defaultdb',
  port: 25674,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
