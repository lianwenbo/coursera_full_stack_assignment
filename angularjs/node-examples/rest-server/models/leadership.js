var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var leaderSchema = new Schema({
    name: {
        type: String,
        required: true
    }, 
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    }
}, {
    timestamps: true
});

var Leadership = mongoose.model('Leadership', leaderSchema)

module.exports = Leadership