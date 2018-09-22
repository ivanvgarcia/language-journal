const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const keys = require('./config/keys');

const app = express();

// Load User Model
require('./models/users');

// Passport Configuration
require('./config/passport')(passport);

// Load Routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const journals = require('./routes/journals');

// Mongoose Connect
mongoose.connect(keys.mongoURI, {
        useNewUrlParser: true
    })
    .then(() => {
        console.log('MongoDB Connected')
    })
    .catch((err) => console.log(err));

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

app.use(express.static(path.join(__dirname, 'public')));

// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Use Routes
app.use('/auth', auth);
app.use('/', index);
app.use('/journals', journals);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});