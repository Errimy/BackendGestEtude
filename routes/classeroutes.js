const express = require("express");
const { check } = require("express-validator"); // use validator instead of {check} if it doesn't work


const classeController = require('../controllers/classe-controller');

const router = express.Router();


router.get("/:cid", classeController.getClasseById);
router.get("/", classeController.getClasses);
router.post('/',
    [
            check('nom_classe').not().isEmpty(),
            check('liste_etudiant'),
            check('emploi_classe'),
    ],
    classeController.createClasse);
router.patch('/:cid',
    [
        check('nom_classe').not().isEmpty(),
        check('liste_etudiant'),
        check('emploi_classe'),
    ],
    classeController.updateClasse);
router.delete('/:cid',classeController.deleteClasse);


module.exports = router;