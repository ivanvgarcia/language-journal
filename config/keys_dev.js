require('dotenv').config();

module.exports = {
    mongoURI: process.env.DEV_DATABASE,
    googleClientID: process.env.GOOGLE_ID,
    googleClientSecret: process.env.GOOGLE_SECRET
}