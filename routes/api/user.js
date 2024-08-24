const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');

// Middleware pour vérifier le JWT sur toutes les routes
router.use(verifyJWT);

router.route('/')
    .get(userController.getAlluser)  // Récupère tous les utilisateurs
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), userController.createNewuser);

router.route('/:id')
    .get(userController.getuser)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), userController.updateuser)
    .delete(verifyRoles(ROLES_LIST.Admin), userController.deleteuser);
    
router.route('/count')
    .get(userController.getUserCount); // Add this route
module.exports = router;
