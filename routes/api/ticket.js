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

router.route('/assign')
    .post(ticketController.assignTicketToUser);   
    
router.route('/:id/start')
    .post(ticketController.startWorkOnTicket);

router.route('/:id/complete')
    .post(ticketController.completeTicketWork);

module.exports = router;
