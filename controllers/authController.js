var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user');
var BearerStrategy = require('passport-http-bearer').Strategy;
var Token = require('../models/token');
var Client = require('../models/client');

// Basic Auth for User.
passport.use("user-basic", new BasicStrategy(
    function(username, password, callback) {
        User.findOne({ username: username }, function(err, user) {
            if (err) {
                return callback(err);
            }

            if (!user) {
                return callback(null, false);
            }

            user.verifyPassword(password, function(err, isMatch) {
                if (err) {
                    return callback(err);
                }

                if (!isMatch) {
                    return callback(null, false);
                }

                return callback(null, user);
            })
        });
    }
));
// use either basic or bearer strategies.
exports.isAuthenticated = passport.authenticate(['user-basic', 'bearer'], { session : false });


// Basic auth for Client only with username as clientId, password as secret.
passport.use('client-basic', new BasicStrategy(
    function(username, password, callback) {
        Client.findOne({ clientId: username }, function (err, client) {
            if (err) { return callback(err); }
            if (!client || client.clientSecret !== password) { return callback(null, false); }

            return callback(null, client);
        });
    }
));
exports.isClientAuthenticated = passport.authenticate('client-basic', { session : false });


passport.use(new BearerStrategy(
    function(accessToken, callback) {
        Token.findOne({value: accessToken }, function (err, token) {
            if (err) { return callback(err); }
            if (!token) { return callback(null, false); }

            User.findOne({ _id: token.userId }, function (err, user) {
                if (err) { return callback(err); }
                if (!user) { return callback(null, false); }

                // Simple example with no scope
                callback(null, user, { scope: '*' });
            });
        });
    }
));
exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });


exports.isSuperuser = function(req, res, next) {
    if (req.user && req.user.isSuperuser) {
        next();
    } else {
        res.statusCode = 401;
        res.send('User not authorized!');
    }
};