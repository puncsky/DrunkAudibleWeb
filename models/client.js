var mongoose = require('mongoose');

var ClientSchema = new mongoose.Schema({
    clientName: { type: String, unique: true, required: true },
    clientId: { type: String, required: true },
    clientSecret: { type: String, required: true },
    userId: { type: String, required: true }
});

module.exports = mongoose.model('Client', ClientSchema);