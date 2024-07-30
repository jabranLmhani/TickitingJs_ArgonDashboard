
const express = require('express');
const router = express.Router();
const clientController = require('../../controllers/clientController');

router.route('/')
    .get(clientController.getAllClients)
    .post(clientController.createNewClient)
    .put(clientController.updateClient)
    .delete(clientController.deleteClient);

router.route('/:id')
    .get(clientController.getClient);

module.exports = router;
