const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const demandeurSchema = new Schema({
    nom: {
        type: String,
        required: true,
        unique: true
    },
    signalerprobleme_description: {
        type: String
    },
    signalerprobleme_type: {
        type: String,
        enum: ['programme', 'technique'],
        required: true
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'client',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Demandeur', demandeurSchema);
