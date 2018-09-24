const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Journal = mongoose.model("journals");
const User = mongoose.model("users");
const {
    ensureAuthenticated
} = require("../helpers/auth");

// Journal Index
router.get("/", (req, res) => {
    Journal.find({
            status: "public"
        })
        .populate("user")
        .sort({
            date: 'desc'
        })
        .then(journals => {
            res.render("journals/index", {
                journals
            });
        });
});

// Show Single Journal
router.get("/show/:id", (req, res) => {
    Journal.findOne({
            _id: req.params.id
        })
        .populate("user")
        .populate("comments.commentUser")
        .then(journal => {
            if (journal.status == 'public' || req.user && req.user.id == journal.user._id) {
                res.render("journals/show", {
                    journal
                });
            } else {
                res.redirect('/journals');
            }
        });
});

// List Journal From a User
router.get('/user/:userId', (req, res) => {
    Journal.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .then(journals => {
            console.log(journals)
            res.render('journals/index', {
                journals
            });
        });
});

// Logged in Users Journals
router.get('/my', ensureAuthenticated, (req, res) => {
    Journal.find({
            user: req.user.id
        })
        .populate('user')
        .then(journals => {
            console.log(journals)
            res.render('journals/index', {
                journals
            });
        });
});

// Add Journal Form
router.get("/add", ensureAuthenticated, (req, res) => {
    res.render("journals/add");
});

// Edit Journal Form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
    Journal.findOne({
        _id: req.params.id
    }).then(journal => {
        if (journal.user != req.user.id) {
            req.flash('success', 'You are not authorized to do that')
            res.redirect('/journals');
        } else {
            res.render("journals/edit", {
                journal
            });
        }
    });
});

// Process Add Story
router.post("/", (req, res) => {
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
    };

    // Create Journal
    new Journal(newJournal).save().then(journal => {
        res.redirect(`/journals/show/${journal.id}`);
    });
});

router.put("/:id", (req, res) => {
    Journal.findOne({
        _id: req.params.id
    }).then(journal => {
        let allowComments;

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

        journal.save().then(journal => {
            res.redirect("/dashboard");
        });
    });
});

// Delete Journal
router.delete("/:id", (req, res) => {
    Journal.deleteOne({
        _id: req.params.id
    }).then(() => {
        req.flash("success", "Your Journal Entry was Deleted!");
        res.redirect("/dashboard");
    });
});

// Add Comment
router.post("/comment/:id", (req, res) => {
    Journal.findOne({
        _id: req.params.id
    }).then(journal => {
        const newComment = {
            commentBody: req.body.commentBody,
            commentUser: req.user.id
        };

        // Add to Comments Array
        journal.comments.unshift(newComment);

        journal.save().then(journal => {
            res.redirect(`/journals/show/${journal.id}`);
        });
    });
});

module.exports = router;