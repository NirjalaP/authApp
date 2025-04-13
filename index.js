const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const passport = require('passport');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const connectEnsureLogin = require('connect-ensure-login');

app.use(express.static(__dirname));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Mongoose setup
mongoose.connect('mongodb://localhost/MyDatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Schema = mongoose.Schema;
const UserDetail = new Schema({
    username: String,
    password: String
});

UserDetail.plugin(passportLocalMongoose);
const UserDetails = mongoose.model('userInfo', UserDetail, 'userInfo');

// Passport config
passport.use(UserDetails.createStrategy());
passport.serializeUser(UserDetails.serializeUser());
passport.deserializeUser(UserDetails.deserializeUser());

// Routes
app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.redirect('/login?info=' + info);
        req.logIn(user, function (err) {
            if (err) return next(err);
            return res.redirect('/');
        });
    })(req, res, next);
});

app.get('/login', (req, res) =>
    res.sendFile('html/login.html', { root: __dirname })
);

app.get('/', connectEnsureLogin.ensureLoggedIn(), (req, res) =>
    res.sendFile('html/index.html', { root: __dirname })
);

app.get('/private', connectEnsureLogin.ensureLoggedIn(), (req, res) =>
    res.sendFile('html/private.html', { root: __dirname })
);

app.get('/user', connectEnsureLogin.ensureLoggedIn(), (req, res) =>
    res.send({ user: req.user })
);

app.get('/logout', (req, res) => {
    req.logout();
    res.sendFile('html/logout.html', { root: __dirname });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('App listening on port ' + port));

//Register soem users
// UserDetails.register({username: 'paul', active: false}, 'paul');
// UserDetails.register({username: 'joy', active: false}, 'joy');
// UserDetails.register({username: 'ray', active: false}, 'ray');
