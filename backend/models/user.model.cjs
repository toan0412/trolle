const db = require('./connectDB.cjs');

const User = {
  findByUsername: async (UserName) => {
    const [rows] = await db.query('SELECT * FROM users WHERE UserName = ?', [UserName]);
    return rows[0];
  },
};

module.exports = User;
