const express = require('express');
const router = express.Router();

router.get('^/$|/index(.html)?', (req, res) => {
    res.render('index'); // Renders the EJS template 'index.ejs'
});

module.exports = router;
