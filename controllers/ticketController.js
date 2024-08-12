const Ticket = require('../model/ticket');
const Client = require('../model/client');
const Demandeur = require('../model/demandeur');
const User = require('../model/User');
const UserTicket = require('../model/userTicket');

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
    const { title, description, client, demandeur, utilisateur, status, type, priorite } = req.body;

    if (!title || !description || !client || !demandeur || !utilisateur || !type || !priorite) {
        return res.status(400).json({ 'message': 'Title, description, client, demandeur, utilisateur, type, and priorite are required' });
    }

    try {
        const clientExists = await Client.findById(client).exec();
        const demandeurExists = await Demandeur.findById(demandeur).exec();
        const utilisateurExists = await User.findById(utilisateur).exec();

        if (!clientExists) return res.status(400).json({ 'message': 'Client not found' });
        if (!demandeurExists) return res.status(400).json({ 'message': 'Demandeur not found' });
        if (!utilisateurExists) return res.status(400).json({ 'message': 'Utilisateur not found' });

        // Create and save the new ticket
        const newTicket = new Ticket({
            title,
            description,
            status,
            type,
            etat: 'en attente',
            priorite,
            client,
            demandeur,
            utilisateur
        });

        const savedTicket = await newTicket.save();

        const userTicket = new UserTicket({
            userId: utilisateur, 
            ticketId: savedTicket._id,
            status: 'en attente', 
            assignedDate: new Date()
        });

        const savedUserTicket = await userTicket.save();

        res.status(201).json({
            message: 'Ticket created and assigned to user',
            ticket: savedTicket,
            userTicket: savedUserTicket
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': 'Server error' });
    }
};

const updateTicket = async (req, res) => {
    const { id, title, description, status, type, priorite, client, demandeur, utilisateur } = req.body;

    if (!id) return res.status(400).json({ 'message': 'ID parameter is required.' });

    try {
        const ticket = await Ticket.findById(id);
        if (!ticket) return res.status(404).json({ 'message': `No ticket matches ID ${id}.` });

        if (title) ticket.title = title;
        if (description) ticket.description = description;
        if (status) ticket.status = status;
        if (type) ticket.type = type;
        if (priorite) ticket.priorite = priorite;
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

const assignTicketToUser = async (req, res) => {
    const { userId, ticketId } = req.body;

    if (!userId || !ticketId) return res.status(400).json({ 'message': 'User ID and Ticket ID are required.' });

    try {
        // Check if ticket and user exist
        const ticket = await Ticket.findById(ticketId);
        const user = await User.findById(userId);

        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Create a new UserTicket entry
        const userTicket = new UserTicket({
            userId,
            ticketId,
            status: 'en cours', 
            assignedDate: new Date()
        });

        await userTicket.save();

        // Update the ticket to show it's assigned
        ticket.assignedTo = userId;
        ticket.etat = 'en cours'; 
        await ticket.save();

        res.status(200).json({ message: 'Ticket assigned to user', userTicket });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

const calculateTimeSpent = async (ticketId) => {
    try {
        const userTickets = await UserTicket.find({ ticketId, status: 'resolu' });
        let totalTime = 0;

        userTickets.forEach((entry) => {
            const timeSpent = (entry.resolvedDate - entry.assignedDate) / (1000 * 60 * 60); 
            totalTime += timeSpent;
        });

        return totalTime;
    } catch (err) {
        console.error(err);
        throw new Error('Error calculating time spent');
    }
};

const startWorkOnTicket = async (req, res) => {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: 'Ticket ID required.' });

    try {
        const ticket = await Ticket.findById(id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        ticket.startWork();
        await ticket.save();

        res.status(200).json(ticket);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const completeTicketWork = async (req, res) => {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: 'Ticket ID required.' });

    try {
        const ticket = await Ticket.findById(id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        ticket.completeWork();
        await ticket.save();

        res.status(200).json(ticket);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllTickets,
    createNewTicket,
    updateTicket,
    deleteTicket,
    assignTicketToUser,
    startWorkOnTicket,
    completeTicketWork,
    getTicket
};
