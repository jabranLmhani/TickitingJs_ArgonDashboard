const express = require('express');
const router = express.Router();
const User = require('../model/User'); // Adjust the path to your User model

// Route to render the tables page
router.get('/tables', async (req, res) => {
    try {
        // Fetch users from the database and convert to plain JavaScript objects
        const users = await User.find().lean();

        // Render the 'tables' EJS template and pass the users data
        res.render('tables', { users });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error'); // Handle errors
    }
});

module.exports = router;
