const User = require('../model/User');
const bcrypt = require('bcryptjs');


const getAlluser = async (req, res) => {
    try {
        const users = await User.find().select('username roles');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const createNewuser = async (req, res) => {
    const { username, roles, password, refreshToken } = req.body;

    if (!username || !password) {
        return res.status(400).json({ 'message': 'Username and password are required.' });
    }

    const user = new User({
        username,
        roles,
        password,
        refreshToken
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


const updateuser = async (req, res) => {
  const { id } = req.params;
  const { username, roles, password, refreshToken } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (username) user.username = username;
    if (roles) user.roles = roles;
    if (password) user.password = await bcrypt.hash(password, 10)
    if (refreshToken) user.refreshToken = refreshToken;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


const deleteuser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.deleteOne(); // Use deleteOne instead of remove
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



const getuser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const getUserCount = async (req, res) => {
    try {
      const count = await User.countDocuments(); // Count total number of documents in the User collection
      res.json({ count });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

module.exports = {
    getAlluser,
    createNewuser,
    updateuser,
    deleteuser,
    getUserCount, 
    getuser
};
