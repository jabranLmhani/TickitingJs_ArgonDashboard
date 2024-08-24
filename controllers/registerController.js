// In registerController.js
const User = require('../model/User');
const bcrypt = require('bcryptjs');

const handleNewUser = async (req, res) => {
    const { username, password, roles } = req.body;

    if (!username || !password) {
        return res.status(400).json({ 'message': 'Username and password are required.' });
    }

    try {
        // Check for duplicate username
        const duplicate = await User.findOne({ username }).exec();
        if (duplicate) return res.sendStatus(409); // Conflict if user already exists

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Set default roles if not provided
        const userRoles = roles || {
            User: 2001,
            Editor: null,
            Admin: null
        };

        // Create the new user
        const newUser = await User.create({
            username,
            password: hashedPassword,
            roles: userRoles
        });

        console.log(newUser);

        res.status(201).json({ 'success': `New user ${username} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };
