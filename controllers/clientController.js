// Load required packages
var Client = require('../models/client');

exports.postClients = function(req, res) {
    var client = new Client();

    client.clientName = req.body.clientName;
    client.clientId = req.body.clientId;
    client.clientSecret = req.body.clientSecret;
    client.userId = req.user._id;

    client.save(function(err) {
        if (err) {
            res.send(err);
            return;
        }

        res.json({ message: 'Client added to the locker!', data: client });
    });
};

exports.getClients = function(req, res) {
    Client.find({ userId: req.user._id }, function(err, clients) {
        if (err)
        {
            res.send(err);
            return;
        }

        res.json(clients);
    });
};

