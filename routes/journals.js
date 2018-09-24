const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Journal = mongoose.model('journals');
const User = mongoose.model('users');
const {
    ensureAuthenticated
} = require('../helpers/auth');

// Journal Index
router.get('/', (req, res) => {
    Journal.find({
            status: 'public'
        })
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

// Add Journal Form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('journals/add');
});

// Edit Journal Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Journal.findOne({
            _id: req.params.id
        })
        .then(journal => {
            res.render('journals/edit', {
                journal
            });
        });
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

router.put('/:id', (req, res) => {
    Journal.findOne({
            _id: req.params.id
        })
        .then(journal => {
            let allowComments

            if (req.body.allowComments) {
                allowComments = true;
            } else {
                allowComments = true;
            }

            // Edited values
            journal.title = req.body.title;
            journal.language = req.body.language;
            journal.body = req.body.body;
            journal.status = req.body.status;
            journal.allowComments = allowComments;

            journal.save()
                .then(journal => {
                    res.redirect('/dashboard');
                });
        });
});

// Delete Journal
router.delete('/:id', (req, res) => {
    Journal.deleteOne({
            _id: req.params.id
        })
        .then(() => {
            res.redirect('/dashboard');
        })
});

module.exports = router;