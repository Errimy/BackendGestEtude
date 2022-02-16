const express = require("express");
const { check } = require("express-validator"); // use validator instead of {check} if it doesn't work


const emploiController = require('../controllers/emploi-controller');

const router = express.Router();


router.get("/:eid", emploiController.getEmploiById);
router.post('/',
    [
            check('matiere'),
            check('jour').not().isEmpty(),
            check('heure').not().isEmpty(),
    ],
    emploiController.createEmploi);
router.patch('/:eid',
    [
        check('matiere'),
        check('jour').not().isEmpty(),
        check('heure').not().isEmpty(),
    ],
    emploiController.updateEmploi);
router.delete('/:eid',emploiController.deleteEmploi);


module.exports = router;