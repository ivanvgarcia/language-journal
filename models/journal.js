const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const JournalSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true,
        default: 'English'
    },
    body: {
        type: String
    },
    status: {
        type: String,
        default: 'public'
    },
    allowComments: {
        type: Boolean,
        default: true
    },
    comments: [{
        commentBody: {
            type: String,
            required: true
        },
        commentDate: {
            type: Date,
            default: Date.now
        },
        commentUser: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Create Collection and Add Schema
mongoose.model('journals', JournalSchema, 'journals');