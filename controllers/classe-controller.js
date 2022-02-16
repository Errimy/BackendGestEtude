const res = require("express/lib/response");
const { validationResult } = require("express-validator");
const Classe=require('../modules/classe');

const getClasseById = async (req, res, next) => {
    const classeId= req.params.cid;
    
    let classe;
    try{
        classe = await Classe.findById(classeId);
    } catch (err){
        const error = new Error('Cette classe n\'existe pas.');
        error.code= 500;
        return next(error);
    }

    if (!classe){
        const error = new Error('Cette classe n\'existe pas.');
        error.code= 404;
        return next(error);
      //   throw(error) if it doens't work
      }
  
    res.json({ classe: classe.toObject( { getters: true }) });
};

const createClasse = async (req, res, next) => {
    const errors= validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('un champs important n\'est pas rempli.');
        error.code= 422;
        return next(error);
    }
    const{ nom_classe,emploi_classe } = req.body;
    const createdClasse= new Classe({
        nom_classe,
        liste_etudiant: [],
        emploi_classe
    });
    try {
        await createdClasse.save();
    } catch(err){
        const error = new Error('La création de la classe a échoué, réessayez.');
        error.code= 500;
        return next(error);
    }

    res.status(201).json({classe: createdClasse});
};

const updateClasse= async (req, res, next) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Erreur lors de la modification de cette classe, réessayez.');
        error.code= 500;
      return next(error);
    }
  
    const { nom_classe, liste_etudiant,emploi_classe  } = req.body;
    const classeId = req.params.cid;
  
    let classe;
    try {
      classe = await Classe.findById(classeId);
    } catch (err) {
        const error = new Error('Erreur lors de la modification de cette classe, réessayez.');
        error.code= 500;
      return next(error);
    }
  
    classe.nom_classe = nom_classe;
    classe.liste_etudiant = liste_etudiant;
    classe.emploi_classe = emploi_classe;
  
    try {
      await classe.save();
    } catch (err) {
      const error = new Error('Erreur lors de la modification de cette classe, réessayez.');
      error.code= 500;
      return next(error);
    }
  
    res.status(200).json({ classe: classe.toObject({ getters: true }) });
};

const deleteClasse= async (req, res, next) =>{
    const classeId= req.params.cid;
    let classe;
    try {
      classe = await Classe.findById(classeId);
    } catch (err) {
        const error = new Error('Problème lors de la suppression de classe.');
        error.code= 500;
      return next(error);
    }
  
    try {
      await classe.remove();
    } catch (err) {
        const error = new Error('Problème lors de la suppression de classe.');
        error.code= 500;
      return next(error);
    }
    res.status(200).json({message: 'classe supprimer.'});

};
const getClasses = async (req, res, next) => {
  let classes;
  try{
    classes = await Classe.find({},'nom_classe');
  }
  catch(err){
    const error = new Error('Erreur lors du chargemet de la page, réessayez plus tard.');
        error.code= 500;
        return next(error);
  }
  res.json({ classes: classes.map(classe => classe.toObject({ getter : true })) });
};
exports.getClasseById= getClasseById;
exports.createClasse= createClasse;
exports.updateClasse= updateClasse;
exports.deleteClasse= deleteClasse;
exports.getClasses= getClasses;