const express = require('express');
const router = express.Router();
const demandeurController = require('../../controllers/demandeurController');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');

// Middleware to verify JWT on all routes
router.use(verifyJWT);

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), demandeurController.getAllDemandeurs)
    .post(verifyRoles(ROLES_LIST.Admin), demandeurController.createNewDemandeur)
    .delete(verifyRoles(ROLES_LIST.Admin), demandeurController.deleteSelectedDemandeurs);

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), demandeurController.getDemandeur)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), demandeurController.updateDemandeur)
    .delete(verifyRoles(ROLES_LIST.Admin), demandeurController.deleteDemandeur);

module.exports = router;
