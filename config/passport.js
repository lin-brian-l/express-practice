const strategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mongo = require('./mongo');
const mongodb = require('mongodb');

module.exports = function(passport) {
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const db = await mongo.connectToDB();
            const findQuery = {
                _id: mongodb.ObjectID(id)
            }
            const user = await db.collection('Users').findOne(findQuery);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
    
    passport.use('login', new strategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, async (req, email, password, done) => {
        try {
            const db = await mongo.connectToDB();
            const user = await db.collection('Users').findOne({email});
            if (!user) {
                return done(null, false);
            }
            const isMatchingPassword = await bcrypt.compare(password, user.passwordHash);
            if (!isMatchingPassword) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    })) 
}