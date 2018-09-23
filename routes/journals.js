const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Journal = mongoose.model('journals');
const User = mongoose.model('users');
const { ensureAuthenticated } = require('../helpers/auth');

// Journal Index
router.get('/', (req, res) => {
    Journal.find({status: 'public'})
        .populate('user')
        .then(journals => {
            res.render('journals/index', {
                journals
            });
        });
});

// Show Single Journal
router.get('/show/:id', (req, res) => {
    Journal.findOne({
        _id: req.params.id
    })
    .populate('user')
    .then(journal => {  
        res.render('journals/show', {
            journal
        });
    });
});

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('journals/add');
});

// Process Add Story
router.post('/', (req, res) => {
    let allowComments;

    if (req.body.allowComments) {
        allowComments = true;
    } else {
        allowComments = false;
    }

    const newJournal = {
        title: req.body.title,
        body: req.body.body,
        language: req.body.language,
        status: req.body.status,
        allowComments: allowComments,
        user: req.user.id
    }

    // Create Journal
    new Journal(newJournal)
        .save()
        .then(journal => {
            res.redirect(`/journals/show/${journal.id}`);
        });
});

module.exports = router;