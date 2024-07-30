const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    nom: {
        type: String,
        required: true
    },
    nbretoiles: {
        type: Number,
        required: true
    },
    numerotele: {
        type: Number,
        required: true
    },
    statut: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('client', clientSchema);
