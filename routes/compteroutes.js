const express = require("express");
const {check} = require("express-validator");

const compteController = require('../controllers/compte-controller');

const router = express.Router();


router.get("/",compteController.getComptes);
router.post('/signup',
    [
        check('nom').not().isEmpty(),
        check('prenom').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('mdp').isLength({min: 5}),
    ]
,compteController.signup);
router.post('/login',compteController.login);

module.exports = router;
