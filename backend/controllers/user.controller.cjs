// controllers/authController.js
const User = require('../models/user.model.cjs');

const login = async (req, res) => {
  const { UserName, Password } = req.body;

  if (!UserName || !Password) {
    return res.status(400).json({ message: 'Username and Password are required' });
  }

  try {
    const user = await User.findByUsername(UserName);
    if (!user || user.Password !== Password) {
      return res.status(401).json({ message: 'Invalid UserName or Password' });
    }

    res.json({ message: 'Login successful', user: { id: user.id, UserName: user.UserName } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { login };
