const express = require("express");
const { check } = require("express-validator"); // use validator instead of {check} if it doesn't work


const examenController = require('../controllers/examen-controller');

const router = express.Router();


router.get("/:exid", examenController.getExamenById);
router.post('/',
    [
            check('matiere').not().isEmpty(),
            check('nom_etudiant').not().isEmpty(),
            check('note').not().isEmpty(),
            check('date').not().isEmpty(),
    ],
    examenController.createExamen);
router.patch('/:exid',
    [
        check('matiere').not().isEmpty(),
        check('nom_etudiant').not().isEmpty(),
        check('note').not().isEmpty(),
        check('date').not().isEmpty(),
    ],
    examenController.updateExamen);
router.delete('/:exid',examenController.deleteExamen);


module.exports = router;