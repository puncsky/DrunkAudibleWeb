var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlbumShema = new Schema({
    SeqId: { type: Number, unique: true },
    Id: { type: Number, unique: true },
    Title: String,
    Description: String,
    LastUpdateTime: Date,
    Narrator: String,
    IconUrl: String,
    Authors: String
});

module.exports = mongoose.model('Album', AlbumShema);