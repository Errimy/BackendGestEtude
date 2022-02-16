const res = require("express/lib/response");
const { validationResult } = require("express-validator");
const Emploi=require('../modules/emploi');

const getEmploiById = async (req, res, next) => {
    const emploiId= req.params.eid;
    
    let emploi;
    try{
        emploi = await Emploi.findById(emploiId);
    } catch (err){
        const error = new Error('Cet emploi n\'existe pas.');
        error.code= 500;
        return next(error);
    }

    if (!emploi){
        const error = new Error('Cet emploi n\'existe pas.');
        error.code= 404;
        return next(error);
      //   throw(error) if it doens't work
      }
  
    res.json({ emploi: emploi.toObject( { getters: true }) });
};

const createEmploi = async (req, res, next) => {
    const errors= validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('un champs important n\'est pas rempli.');
        error.code= 422;
        return next(error);
    }
    const{ matiere, jour , heure } = req.body;
    const createdEmploi= new Emploi({
        matiere,
        jour,
        heure
    });
    try {
        await createdEmploi.save();
    } catch(err){
        const error = new Error('La création de cet emploi a échoué, réessayez.');
        error.code= 500;
        return next(error);
    }

    res.status(201).json({emploi: createdEmploi});
};

const updateEmploi= async(req, res, next) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Erreur lors de la modification de cet emploi, réessayez.');
        error.code= 500;
      return next(error);
    }
  
    const { matiere, jour , heure  } = req.body;
    const emploiId = req.params.eid;
  
    let emploi;
    try {
      emploi = await Emploi.findById(emploiId);
    } catch (err) {
        const error = new Error('Erreur lors de la modification de cet emploi, réessayez.');
        error.code= 500;
      return next(error);
    }
  
    emploi.matiere = matiere;
    emploi.jour = jour;
    emploi.heure = heure;
  
    try {
      await emploi.save();
    } catch (err) {
      const error = new Error('Erreur lors de la modification de cet emploi, réessayez.');
      error.code= 500;
      return next(error);
    }
  
    res.status(200).json({ emploi: emploi.toObject({ getters: true }) });
};

const deleteEmploi= async(req, res, next) =>{
    const emploiId= req.params.eid;
    let emploi;
    try {
      emploi = await Emploi.findById(emploiId);
    } catch (err) {
        const error = new Error('Problème lors de la suppression d\' emploi.');
        error.code= 500;
      return next(error);
    }
  
    try {
      await emploi.remove();
    } catch (err) {
        const error = new Error('Problème lors de la suppression d\'emploi.');
        error.code= 500;
      return next(error);
    }
    res.status(200).json({message: 'emploi supprimer.'});
};
const getEmplois = async (req, res, next) => {
  let emplois;
  try{
    emplois = await Emploi.find({},'matiere jour heure');
  }
  catch(err){
    const error = new Error('Erreur lors du chargemet de la page, réessayez plus tard.');
        error.code= 500;
        return next(error);
  }
  res.json({ emplois: emplois.map(emploi => emploi.toObject({ getter : true })) });
};
exports.getEmplois = getEmplois;
exports.getEmploiById = getEmploiById;
exports.createEmploi = createEmploi;
exports.updateEmploi = updateEmploi;
exports.deleteEmploi = deleteEmploi;