const express = require('express');
const router = express.Router();
const clientController = require('../../controllers/clientController');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');

// Middleware to verify JWT on all routes
router.use(verifyJWT);

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), clientController.getAllClients) // Allow only Admin and Editor to get all clients
    .post(verifyRoles(ROLES_LIST.Admin), clientController.createNewClient) // Allow only Admin to create a new client
    .delete(verifyRoles(ROLES_LIST.Admin), clientController.deleteSelectedClients); // Allow only Admin to delete selected clients
router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), clientController.getClient)// Allow Admin and Editor to get a specific client
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), clientController.updateClient) // Allow Admin and Editor to update a client
    .delete(verifyRoles(ROLES_LIST.Admin), clientController.deleteClient); // Allow only Admin to delete a client

module.exports = router;
