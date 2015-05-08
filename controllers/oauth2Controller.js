var oauth2orize = require('oauth2orize');
var User = require('../models/user');
var Client = require('../models/client');
var Token = require('../models/token');
var Code = require('../models/code');


// configure oauth2orize server
var server = oauth2orize.createServer();

// Serialize client for storage.
server.serializeClient(function(client, callback) {
    return callback(null, client._id);
});

// Deserialize client for verification at the exchange process.
server.deserializeClient(function(id, callback) {
    Client.findOne({ _id: id }, function (err, client) {
        if (err) { return callback(err); }
        return callback(null, client);
    });
});

// Generate code and save into database for later exchange.
server.grant(oauth2orize.grant.code(function(client, redirectUri, user, ares, callback) {
    // Create a new authorization code
    var code = new Code({
        value: uid(16),
        clientId: client._id,
        redirectUri: redirectUri,
        userId: user._id
    });

    code.save(function(err) {
        if (err) { return callback(err); }

        callback(null, code.value);
    });
}));

// Exchange code (for bearer token).
server.exchange(oauth2orize.exchange.code(function(client, code, redirectUri, callback) {
    Code.findOne({ value: code }, function (err, authCode) {
        if (err) { return callback(err); }
        if (!authCode || authCode === undefined) { return callback(null, false); }
        if (client._id.toString() !== authCode.clientId) { return callback(null, false); }
        if (redirectUri !== authCode.redirectUri) { return callback(null, false); }

        // Delete auth code now that it has been used
        authCode.remove(function (err) {
            if(err) { return callback(err); }

            // Create a new access token
            var token = new Token({
                value: uid(256),
                clientId: authCode.clientId,
                userId: authCode.userId
            });

            // Save the access token and check for errors
            token.save(function (err) {
                if (err) { return callback(err); }

                callback(null, token);
            });
        });
    });
}));


// exports actions
// GET /authorization
exports.authorization = [
    // match client id
    server.authorization(function(clientId, redirectUri, callback) {
        Client.findOne({ clientId: clientId }, function (err, client) {
            if (err) { return callback(err); }

            return callback(null, client, redirectUri);
        });
    }),
    // render authorization web page
    function(req, res){
        res.render('dialog', {
            transactionID: req.oauth2.transactionID,
            user: req.user,
            client: req.oauth2.client });
    }
];

// POST /decision
exports.decision = [
    server.decision()
];

// POST /token
exports.token = [
    server.token(),
    server.errorHandler()
];

/** @private */
function uid(len) {
    var buf = [];
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charlen = chars.length;

    for (var i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
}

/** @private */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}