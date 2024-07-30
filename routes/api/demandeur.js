const express = require('express');
const router = express.Router();
const demandeurController = require('../../controllers/demandeurController');


router.route('/')
    .get(demandeurController.getAllDemandeurs)
    .post(demandeurController.createNewDemandeur);

router.route('/:id')
    .get(demandeurController.getDemandeur)
    .put(demandeurController.updateDemandeur)
    .delete(demandeurController.deleteDemandeur);

module.exports = router;
