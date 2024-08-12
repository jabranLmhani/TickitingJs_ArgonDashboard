// models/UserTicket.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserTicketSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ticketId: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
    assignedDate: { type: Date, default: Date.now },
    resolvedDate: { type: Date }, // Filled when ticket is resolved
    status: {
        type: String,
        enum: ['en cours', 'en attente', 'necessite intervention', 'rejeté', 'resolu'],
        default: 'en attente',
    }
});

module.exports = mongoose.model('UserTicket', UserTicketSchema);
