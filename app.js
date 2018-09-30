const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const keys = require("./config/keys");

const app = express();

// Load Models
require("./models/user");
require("./models/journal");

// Handlebars Helpers
const {
  truncate,
  stripTags,
  formatDate,
  formatDateRelative,
  select,
  editIcon,
  deleteIcon
} = require("./helpers/hbs");

// Passport Configuration
require("./config/passport")(passport);

// Load Routes
const auth = require("./routes/auth");
const index = require("./routes/index");
const journals = require("./routes/journals");

// Mongoose Connect
mongoose
  .connect(
    keys.mongoURI,
    {
      useNewUrlParser: true
    }
  )
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch(err => console.log(err));

// caching disabled for every route
app.use(function(req, res, next) {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Set Global Variables
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Path Join Middleware
app.use(express.static(path.join(__dirname, "public")));

// Body Parser Middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// Method Override Middleware
app.use(methodOverride("_method"));

// Handlebars Middleware
app.engine(
  "handlebars",
  exphbs({
    helpers: {
      truncate,
      stripTags,
      formatDate,
      formatDateRelative,
      select,
      editIcon,
      deleteIcon
    },
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Use Routes
app.use("/auth", auth);
app.use("/", index);
app.use("/journals", journals);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
