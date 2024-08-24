const express = require('express');
const router = express.Router();
const ticketController = require('../../controllers/ticketController');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), ticketController.getAllTickets)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), ticketController.createNewTicket);

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), ticketController.getTicket)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), ticketController.updateTicket)
    .delete(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), ticketController.deleteTicket);

router.route('/assign')
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), ticketController.assignTicketToUser);

router.route('/:id/start')
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), ticketController.startWorkOnTicket);

router.route('/:id/complete')
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), ticketController.completeTicketWork);
    
    
router.route('/bulk-delete')
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), ticketController.bulkDeleteTickets);
module.exports = router;
