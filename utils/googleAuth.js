const passport = require("passport")
const Users = require("../models/userModel")
var GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://www.google.com/",
    passReqToCallback: true
},
    function (request, accessToken, refreshToken, profile, done) {
        Users.findOrCreate({ name: profile.name, email: profile.emails[0], password: accessToken, }, function (err, user) {
            return done(err, user);
        });
    }
));