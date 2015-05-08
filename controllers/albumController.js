var Album = require('../models/album');

// POST /albums
exports.postAlbums = function(req, res) {
    var album = new Album({
        Title: req.body.Title,
        Id: req.body.Id,
        Authors: req.body.Authors,
        Narrator: req.body.Narrator,
        Description: req.body.Description,
        LastUpdateTime: Date.now(),
        IconUrl: req.body.IconUrl,
        SeqId: req.body.SeqId
    });

    album.save(function (err) {
        if (err) {
            res.statusCode = 400;
            return res.send(err);
        }

        res.json({ message: 'Album created!' });
    });
};

// GET /albums
exports.getAlbums = function(req, res) {
    Album.find(function (err, albums) {
        if (err) {
            res.statusCode = 400;
            return res.send(err);
        }

        res.json(albums);
    });
};


// GET albums/:albumId
exports.getAlbumByAlbumId = function(req, res) {
    Album.findById(req.params.albumId, function (err, album) {
        if (err) {
            res.statusCode = 400;
            return res.send(err);
        }

        res.json(album);
    });
};

// PUT albums/:albumId
exports.putAlbumByAlbumId = function(req, res) {
    Album.findById(req.params.albumId, function (err, album) {
        if (err) {
            res.statusCode = 400;
            return res.send(err);
        }

        album.title = req.body.title;

        album.save(function (err) {
            if (err) {
                res.statusCode = 400;
                return res.send(err);
            }

            res.json({ message: 'Album updated!' });
        });
    });
};

// DELETE albums/:albumId
exports.deleteAlbumByAlbumId = function(req, res) {
    Album.remove({ _id: req.params.albumId }, function (err, album) {
        if (err) {
            res.statusCode = 400;
            return res.send(err);
        }

        res.json({ message: 'Successfully deleted ' + album.title });
    });
};