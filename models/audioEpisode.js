var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AudioEpisodeShema = new Schema({
    SeqId: { type: Number },
    Id: { type: Number, unique: true },
    Title: String,
    Description: String,
    LastUpdateTime: Date,
    Narrator: String,
    IconUrl: String,
    Authors: String,
    RemoteUrl: String,
    FileSize: Number,
    Duration: Number,
    Price: Number
});

module.exports = mongoose.model('AudioEpisode', AudioEpisodeShema);
