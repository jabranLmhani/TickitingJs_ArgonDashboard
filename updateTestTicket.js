require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const Ticket = require('./model/ticket');
const UserTicket = require('./model/userTicket');

const updateTestTicket = async () => {
    try {
        await connectDB(); // Ensure the database is connected

        // Replace with an actual ticket ID from your database
        const ticketId = '66cc5ef669c2ee72c4b72eea'; 

        // Find the ticket and check if it exists
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            console.log('Ticket not found.');
            process.exit(1);
        }

        // Update the ticket status to 'resolu'
        ticket.status = 'resolu';
        await ticket.save();

        // Update UserTicket status to 'resolu' and set resolvedDate
        await UserTicket.updateMany(
            { ticketId: ticketId, status: 'en attente' },
            { $set: { status: 'resolu', resolvedDate: new Date() } }
        );

        // Fetch updated ticket and UserTicket for verification
        const updatedTicket = await Ticket.findById(ticketId);
        const userTickets = await UserTicket.find({ ticketId: ticketId });

        console.log('Updated Ticket:', updatedTicket);
        console.log('UserTickets:', userTickets);
    } catch (err) {
        console.error('Error updating test ticket:', err);
    } finally {
        mongoose.connection.close();
    }
};

updateTestTicket();
