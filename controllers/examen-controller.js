const res = require("express/lib/response");
const { validationResult } = require("express-validator");
const Examen=require('../modules/examen');

const getExamenById = async (req, res, next) => {
    const examenId= req.params.exid;
    
    let examen;
    try{
        examen = await Examen.findById(examenId);
    } catch (err){
        const error = new Error('Cet examen n\'existe pas.');
        error.code= 500;
        return next(error);
    }

    if (!examen){
        const error = new Error('Cet examen n\'existe pas.');
        error.code= 404;
        return next(error);
      //   throw(error) if it doens't work
      }
  
    res.json({ examen: examen.toObject( { getters: true }) });
};

const createExamen = async (req, res, next) => {
    const errors= validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('un champs important n\'est pas rempli.');
        error.code= 422;
        return next(error);
    }
    const{ matiere, nom_etudiant, note, date} = req.body;
    const createdExamen= new Examen({
        matiere,
        nom_etudiant, 
        note, 
        date
    });
    try {
        await createdExamen.save();
    } catch(err){
        const error = new Error('La création d\'examen a échoué, réessayez.');
        error.code= 500;
        return next(error);
    }

    res.status(201).json({examen: createdExamen});
};

const updateExamen= async(req, res, next) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Erreur lors de la modification de cet examen, réessayez.');
        error.code= 500;
      return next(error);
    }
  
    const { matiere, nom_etudiant, note, date  } = req.body;
    const examenId = req.params.exid;
  
    let examen;
    try {
      examen = await Examen.findById(examenId);
    } catch (err) {
        const error = new Error('Erreur lors de la modification de cet examen, réessayez.');
        error.code= 500;
      return next(error);
    }
  
    examen.matiere= matiere;
    examen.nom_etudiant = nom_etudiant;
    examen.note = note;
    examen.date = date;
  
    try {
      await examen.save();
    } catch (err) {
      const error = new Error('Erreur lors de la modification de cet examen, réessayez.');
      error.code= 500;
      return next(error);
    }
  
    res.status(200).json({ examen: examen.toObject({ getters: true }) });
};

const deleteExamen= async(req, res, next) =>{
    const examenId= req.params.exid;
    let examen;
    try {
      examen = await Examen.findById(examenId);
    } catch (err) {
        const error = new Error('Problème lors de la suppression d\' examen.');
        error.code= 500;
      return next(error);
    }
  
    try {
      await examen.remove();
    } catch (err) {
        const error = new Error('Problème lors de la suppression d\'examen.');
        error.code= 500;
      return next(error);
    }
    res.status(200).json({message: 'examen supprimer.'});

};

exports.getExamenById= getExamenById;
exports.createExamen= createExamen;
exports.updateExamen= updateExamen;
exports.deleteExamen= deleteExamen;