const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const keys = require('./config/keys');

// Load User Model
require('./models/users');

// Passport Configuration
require('./config/passport')(passport);

// Load Routes
const auth = require('./routes/auth');

// Mongoose Connect
mongoose.connect(keys.mongoURI, {
        useNewUrlParser: true
    })
    .then(() => {console.log('MongoDB Connected')})
    .catch((err) => console.log(err));

const app = express();

app.get('/', (req, res) => {
    res.send('index');
});

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set Global Variables
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Use Routes
app.use('/auth', auth);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});