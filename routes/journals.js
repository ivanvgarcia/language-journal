const express = require('express');
const router = express.Router();

// Stories Index
router.get('/', (req, res) => {
    res.render('journals/index');
});

router.get('/add', (req, res) => {
    res.render('journals/add');
});

module.exports = router;