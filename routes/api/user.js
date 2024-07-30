const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const ROLES_LIST = require('../../config/roles_list');

const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyroles');

router.route('/')
    .get(userController.getAlluser)

    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), userController.createNewuser)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), userController.updateuser)
    .delete(verifyRoles(ROLES_LIST.Admin), userController.deleteuser);

router.route('/:id')
    .get(userController.getuser);

module.exports = router;