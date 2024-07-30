const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    priority: { type: String, required: true },
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    demandeur: { type: Schema.Types.ObjectId, ref: 'Demandeur', required: true },
    utilisateur: { type: Schema.Types.ObjectId, ref: 'User', required: true } // Ensure this matches the actual field name
});

const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
