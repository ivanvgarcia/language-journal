require('dotenv').config();

if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: process.env.PROD_DATABASE,
        googleClientID: process.env.GOOGLE_ID,
        googleClientSecret: process.env.GOOGLE_SECRET
    }
} else {
    module.exports = {
        mongoURI: process.env.DEV_DATABASE,
        googleClientID: process.env.GOOGLE_ID,
        googleClientSecret: process.env.GOOGLE_SECRET
    }
}