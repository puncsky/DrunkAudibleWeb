var User = require('../models/user');

// POST /users
exports.postUsers = function(req, res) {
    var user = new User({
        username: req.body.username,
        password: req.body.password,
        isSuperuser: false,
        dateJoined: Date.now(),
        email: req.body.email
    });

    user.save(function(err) {
        if (err) {
            res.statusCode = 400;
            return res.send(err);
        }

        res.json({ message: 'New user was added!'});
    });
};

// GET /users
exports.getUsers = function(req, res) {
    User.find(function(err, users) {
        if (err) {
            res.status = 400;
            return res.send(err);
        }

        res.json(users);
    });
};

// PUT /users/superuser/:userId
exports.setSuperuser = function(req, res) {
    User.findById(req.params.userId, function(err, user) {
        if (err) {
            res.statusCode = 400;
            return res.send(err);
        }

        if (user === null || user === undefined) {
            res.statusCode = 404;
            return res.json('userId not found!');
        }

        user.isSuperuser = true;

        user.save(function (err) {
            if (err) {
                res.statusCode = 400;
                return res.send(err);
            }

            res.json(user.username + " was set to Superuser");
        });
    })
};

// GET /user
exports.getUser = function(req, res) {
    var user = new User(req.user);
    user.password = null;
    res.send(user);
};

// PUT /user
exports.putUser = function(req, res) {
    req.user.username = req.body.username;
    req.user.password = req.body.password;
    req.user.email = req.body.email;

    req.user.save(function (err) {
        if (err) {
            res.statusCode = 400;
            return res.send(err);
        }

        res.json({ message: 'User updated!' });
    });
};

// DELETE /user
exports.deleteUser = function(req, res) {
    User.remove({ _id: req.user._id }, function (err, user) {
        if (err) {
            res.statusCode = 400;
            return res.send(err);
        }

        res.json({ message: 'Successfully deleted user!' });
    });
};