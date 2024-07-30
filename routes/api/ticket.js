const express = require('express');
const router = express.Router();
const ticketController = require('../../controllers/ticketController');


router.route('/')
    .get(ticketController.getAllTickets)
    .post(ticketController.createNewTicket);

router.route('/:id')
    .put(ticketController.updateTicket)
    .delete(ticketController.deleteTicket)
    .get(ticketController.getTicket);

module.exports = router;
