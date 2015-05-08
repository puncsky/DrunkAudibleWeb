var EpisodesByAlbumId = require('../models/episodesByAlbumId');
var mongoose = require('mongoose');
var AudioEpisode = mongoose.model('AudioEpisode');

// POST /albums/:albumId/episodes
exports.postAlbumEpisodes = function(req, res) {
    var recvEpisodes = req.body;

    var episodesByAlbumId = new EpisodesByAlbumId();
    episodesByAlbumId.AlbumId = req.params.albumId;

    recvEpisodes.forEach(function(ep) {
        var episode = new AudioEpisode({
            Authors: ep.Authors,
            Description: ep.Description,
            Duration: ep.Duration,
            IsPurchased: ep.IsPurchased,
            IconUrl: ep.IconUrl,
            LastUpdateTime: Date.now(),
            Narrator: ep.Narrator,
            SeqId: ep.SeqId,
            Price: ep.Price,
            Title: ep.Title,
            Id: ep.Id,
            RemoteUrl: ep.RemoteUrl,
            FileSize: ep.FileSize
        });
        episode.save(function(err) {
            if (err) {
                res.statusCode = 400;
                return res.send(err);
            }
        });
        episodesByAlbumId.Episodes.push(episode);
    });
    if (res.statusCode != 200) return;

    episodesByAlbumId.save(function (err) {
        if (err) {
            res.statusCode = 400;
            return res.send(err);
        }

        res.json({ message: 'episodesByAlbumId created!' });
    });
};

// GET /albums/:albumId/episodes
exports.getAlbumEpisodes = function(req, res) {
    EpisodesByAlbumId.findOne({ AlbumId: req.params.albumId })
        .populate('Episodes')
        .exec(function (err, episodeByAlbumId) {
            if (err) {
                res.statusCode = 400;
                return res.send(err);
            }

            res.send(episodeByAlbumId.Episodes);
        });
};