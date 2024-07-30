const Ticket = require('../model/ticket'); 
const Client = require('../model/client'); 
const Demandeur = require('../model/demandeur');
const User = require('../model/User'); 


const getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find()
            .populate('client')
            .populate('demandeur')
            .populate('utilisateur'); 
        if (!tickets.length) return res.status(204).json({ 'message': 'No tickets found.' });
        res.json(tickets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': 'Server error' });
    }
};


const createNewTicket = async (req, res) => {
    const { title, description, client, demandeur, utilisateur, status, priority } = req.body; 

    if (!title || !description || !client || !demandeur || !utilisateur) {
        return res.status(400).json({ 'message': 'Title, description, client, demandeur, and utilisateur are required' });
    }

    try {
        const clientExists = await Client.findById(client).exec();
        const demandeurExists = await Demandeur.findById(demandeur).exec();
        const utilisateurExists = await User.findById(utilisateur).exec(); 

        if (!clientExists) return res.status(400).json({ 'message': 'Client not found' });
        if (!demandeurExists) return res.status(400).json({ 'message': 'Demandeur not found' });
        if (!utilisateurExists) return res.status(400).json({ 'message': 'Utilisateur not found' }); 

        const newTicket = new Ticket({
            title,
            description,
            status,
            priority,
            client,
            demandeur,
            utilisateur 
        });

        const result = await newTicket.save();
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': 'Server error' });
    }
};


const updateTicket = async (req, res) => {
    const { id, title, description, status, priority, client, demandeur, utilisateur } = req.body; 

    if (!id) return res.status(400).json({ 'message': 'ID parameter is required.' });

    try {
        const ticket = await Ticket.findById(id);
        if (!ticket) return res.status(404).json({ 'message': `No ticket matches ID ${id}.` });

        if (title) ticket.title = title;
        if (description) ticket.description = description;
        if (status) ticket.status = status;
        if (priority) ticket.priority = priority;
        if (client) {
            const clientExists = await Client.findById(client);
            if (!clientExists) return res.status(400).json({ 'message': 'Client not found' });
            ticket.client = client;
        }
        if (demandeur) {
            const demandeurExists = await Demandeur.findById(demandeur);
            if (!demandeurExists) return res.status(400).json({ 'message': 'Demandeur not found' });
            ticket.demandeur = demandeur;
        }
        if (utilisateur) {
            const utilisateurExists = await User.findById(utilisateur); 
            if (!utilisateurExists) return res.status(400).json({ 'message': 'Utilisateur not found' });
            ticket.utilisateur = utilisateur; 
        }
        ticket.updatedDate = Date.now();

        const result = await ticket.save();
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': 'Server error' });
    }
};


const deleteTicket = async (req, res) => {
    const { id } = req.body;

    if (!id) return res.status(400).json({ 'message': 'Ticket ID required.' });

    try {
        const ticket = await Ticket.findById(id);
        if (!ticket) return res.status(404).json({ 'message': `No ticket matches ID ${id}.` });

        const result = await ticket.deleteOne();
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': 'Server error' });
    }
};


const getTicket = async (req, res) => {
    const { id } = req.params;

    if (!id) return res.status(400).json({ 'message': 'Ticket ID required.' });

    try {
        const ticket = await Ticket.findById(id)
            .populate('client')
            .populate('demandeur')
            .populate('utilisateur'); 
        if (!ticket) return res.status(404).json({ 'message': `No ticket matches ID ${id}.` });

        res.json(ticket);
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': 'Server error' });
    }
};

module.exports = {
    getAllTickets,
    createNewTicket,
    updateTicket,
    deleteTicket,
    getTicket
};
