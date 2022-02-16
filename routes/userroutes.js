const express = require("express");
const { check } = require("express-validator"); // use validator instead of {check} if it doesn't work


const userController = require('../controllers/user-controller');

const router = express.Router();


router.get("/:uid", userController.getUserById);
router.get('/classe/:cid', userController.getUsersByClasseId);
router.get("/", userController.getUsers);
router.post('/',
    [
            check('nom').not().isEmpty(),
            check('prenom').not().isEmpty(),
            check('mdp').not().isEmpty(),
            check('classe_user').not().isEmpty(),
            check('email').normalizeEmail().isEmail(),
    ],
    userController.signup);
router.patch('/:uid',
    [
            check('nom').not().isEmpty(),
            check('prenom').not().isEmpty(),
            check('classe_user').not().isEmpty(),
            check('email').normalizeEmail().isEmail(),
    ],
    userController.updateUser);
router.delete('/:uid',userController.deleteUser);
router.post('/login',userController.login);


module.exports = router;
