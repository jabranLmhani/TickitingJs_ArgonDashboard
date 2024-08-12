const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    demandeur: { type: Schema.Types.ObjectId, ref: 'Demandeur', required: true },
    utilisateur: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Ensure this matches the actual field name
    type: { type: String, enum: ['logiciel', 'technique'], required: true },
    etat: { type: String, enum: ['en cours', 'en attente', 'necessite intervention', 'rejeté', 'resolu'], default: 'en attente' },
    priorite: { type: String, enum: ['haute', 'moyenne', 'basse'], required: true },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
    startedDate: { type: Date },  
    completedDate: { type: Date },  
    timeTaken: { type: Number }  
});

ticketSchema.methods.startWork = function () {
    this.startedDate = Date.now();
    this.etat = 'en cours';
};


ticketSchema.methods.completeWork = function () {
    this.completedDate = Date.now();
    this.etat = 'resolu';
    if (this.startedDate) {
        this.timeTaken = this.completedDate - this.startedDate;
    } else {
        console.warn("Work was completed but start date was not set");
    }
};


const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
