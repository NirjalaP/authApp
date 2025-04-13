const express = require('express');
const app = express();

app.use(express.static(_dirname));

const bodyParser = require("body-parse");
const expressSession = require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSession);

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log('App Listening on port ' + port));


// Passport setup
const passport = require ('passport');
app.use(passport.initialize());
app.use(passport.session());