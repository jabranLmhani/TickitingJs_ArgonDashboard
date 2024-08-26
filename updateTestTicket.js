require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const Ticket = require('./model/ticket');
const UserTicket = require('./model/userTicket');

const updateTestTicket = async () => {
    try {
        await connectDB(); 

      
        const ticketId = '66cc5ef669c2ee72c4b72eea'; 

       
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            console.log('Ticket not found.');
            process.exit(1);
        }

     
        ticket.status = 'resolu';
        await ticket.save();

      
        await UserTicket.updateMany(
            { ticketId: ticketId, status: 'en attente' },
            { $set: { status: 'resolu', resolvedDate: new Date() } }
        );

      
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
