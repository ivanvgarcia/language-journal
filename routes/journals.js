const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');

// Stories Index
router.get('/', (req, res) => {
    res.render('journals/index');
});

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('journals/add');
});

module.exports = router;