require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const Ticket = require('./model/ticket');
const Client = require('./model/client');
const Demandeur = require('./model/demandeur');
const User = require('./model/User');
const UserTicket = require('./model/userTicket');

const createTestTicket = async () => {
    try {
        await connectDB(); // Ensure the database is connected

        // Create test data (replace IDs with actual existing IDs in your database)
        const client = await Client.findOne(); // Or create a new client if necessary
        const demandeur = await Demandeur.findOne(); // Or create a new demandeur
        const user = await User.findOne(); // Or create a new user

        if (!client || !demandeur || !user) {
            console.log('Please make sure that client, demandeur, and user exist in the database.');
            process.exit(1);
        }

        const newTicket = new Ticket({
            title: 'Test Ticket',
            description: 'This is a test ticket.',
            status: 'open',
            type: 'logiciel',
            etat: 'en attente',
            priorite: 'haute',
            client: client._id,
            demandeur: demandeur._id,
            utilisateur: user._id
        });

        const savedTicket = await newTicket.save();

        // Logic for creating UserTicket (since there's no utils.js)
        const userTicket = new UserTicket({
            userId: user._id,
            ticketId: savedTicket._id,
            status: 'en attente',
            assignedDate: new Date()
        });

        const savedUserTicket = await userTicket.save();

        console.log('Test Ticket created:', savedTicket);
        console.log('UserTicket created:', savedUserTicket);
    } catch (err) {
        console.error('Error creating test ticket:', err);
    } finally {
        mongoose.connection.close();
    }
};

  
createTestTicket();
