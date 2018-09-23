const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Journal = mongoose.model('journals');
const {
    ensureAuthenticated,
    ensureGuest
} = require('../helpers/auth');

router.get('/', ensureGuest, (req, res) => {
    res.render('index/welcome');
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    Journal.find({user:req.user.id})
        .then(journals => {
            res.render('index/dashboard', {
                journals
            });
        })
});

router.get('/about', (req, res) => {
    res.render('index/about');
});



module.exports = router;