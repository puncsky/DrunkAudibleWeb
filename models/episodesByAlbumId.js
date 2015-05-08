var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AudioEpisode = require('./AudioEpisode');

var EpisodesByAlbumIdSchema = new Schema({
    AlbumId: { type: Number, unique: true },
    Episodes: [ { type: Schema.Types.ObjectId, ref: 'AudioEpisode' } ]
});

module.exports = mongoose.model('EpisodesByAlbumId', EpisodesByAlbumIdSchema);