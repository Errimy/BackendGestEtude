const res = require("express/lib/response");
const { validationResult } = require("express-validator");
const User=require('../modules/user');
const Classe=require('../modules/classe');
const mongoose = require('mongoose');


const getUserById = async (req, res, next) => {
    const userId= req.params.uid;
    
    let user;
    try{
        user = await User.findById(userId);
    } catch (err){
        const error = new Error('Erreur lors du chargement de la page de ce compte.');
        error.code= 500;
        return next(error);
    }

    if (!user){
        const error = new Error('Ce compte n\'existe pas.');
        error.code= 404;
        return next(error);
      //   throw(error) if it doens't work
      }
  
    res.json({ user: user.toObject( { getters: true }) });
};

const signup = async (req, res, next) => {
    const errors= validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('un champs important n\'est pas rempli.');
        error.code= 422;
        return next(error);
    }
    const{ nom, prenom, email, mdp, classe_user, role} = req.body;
    let existingUser
    try {
      existingUser = await User.findOne({ email: email })
    } catch (err) {
      const error = new Error('La création de compte a échoué, réessayez.');
      error.code= 500;
      return next(error);
    }
    
    if (existingUser) {
      const error = new Error('Ce compte existe déjà, vous pouvez vous connectez.');
      error.code= 422;
      return next(error);
    }

    const createdUser= new User({
        nom,
        prenom,
        email,
        mdp,
        classe_user,
        role,
    });

    let classe;
    try {
      classe = await  Classe.findById(classe_user);
      
    } catch (err) {
      const error = new Error('La création de compte a échoué, réessayez.');
      error.code= 422;
      return next(error);
    }

    if(!classe){
      const error = new Error('Pas pu trouver la classe pour cette ID.');
      error.code= 404;
      return next(error);
    }

    console.log(classe);

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdUser.save({session: sess});
        classe.liste_etudiant.push(createdUser);
        await classe.save({session : sess});
        await sess.commitTransaction();
    } catch(err){
        const error = new Error('La création de compte a échoué, réessayez.');
        error.code= 500;
        return next(error);
    }

    res.status(201).json({user: createdUser});
};

const updateUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Erreur lors de la modification de ce compte, réessayez.');
        error.code= 500;
      return next(error);
    }
  
    const { nom, prenom, email, mdp, classe_user, role } = req.body;
    const userId = req.params.uid;


    let user;
    try {
      user = await User.findById(userId);
    } catch (err) {
        const error = new Error('Erreur lors de la modification de ce compte.');
        error.code= 500;
      return next(error);
    }

  
    user.nom = nom;
    user.prenom = prenom;
    user.email = email;
    user.mdp = mdp;
    user.classe_user = classe_user;
    user.role = role;
  
    try {
      await User.findByIdAndUpdate(
        { _id : userId},
        user,
        { runValidators: false, context: 'query' }
    )
    } catch (err) {
      console.log(err);
      const error = new Error('Erreur lors de la sauvegarde de modification de ce compte.'+err);
      error.code= 500;
      return next(error);
    }
  
    res.status(200).json({ user: user.toObject({ getters: true }) });
};

const deleteUser= async (req, res, next) =>{
    const userId= req.params.uid;
    let user;
    try {
      user = await User.findById(userId).populate('classe_user');
    } catch (err) {
        const error = new Error('Problème lors de la suppression du compte.');
        error.code= 500;
      return next(error);
    }

    if(!user){
      const error = new Error('Pas pu trouver le compte pour le supprimer.');
      error.code= 404;
    return next(error);
    }

    try {
      const sess = await mongoose.startSession();
        sess.startTransaction();
        await user.remove({session: sess});
        user.classe_user.liste_etudiant.pull(user);
        await user.classe_user.save({session : sess});
        await sess.commitTransaction();
    } catch (err) {
        const error = new Error('Problème lors de la suppression du compte.');
        error.code= 500;
      return next(error);
    }
    res.status(200).json({message: 'Compte supprimer.'});

};

const getUsersByClasseId = async (req, res, next) => {
    const classeId= req.params.cid;
    
    let users;
    try{
        users= await User.find({classe_user: classeId});
    } catch (err){
        const error = new Error('Cette classe ne contient aucun étudiant.');
        error.code= 500;
        return next(error);
    }

    if (!users){
        const error = new Error('Cette classe ne contient aucun étudiant.');
        error.code= 404;
        return next(error);
      //   throw(error) if it doens't work
      }
  
    res.json({ users: users.map(user => user.toObject({ getter : true })) });
};


const login = async (req, res, next) => {
  const { email, mdp } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email })
  } catch (err) {
    const error = new Error('La connexion a échoué, réessayez.');
        error.code= 500;
        return next(error);
  }

  if (!existingUser || existingUser.mdp !== mdp) {
    const error = new Error('La connexion a échoué, réessayez.');
        error.code= 500;
        return next(error);
  }

  res.json({message: 'Connexion réussie.'});
};

const getUsers = async (req, res, next) => {
  let users;
  try{
    users = await User.find({},'nom prenom email mdp classe role');
  }
  catch(err){
    const error = new Error('Erreur lors du chargemet de la page, réessayez plus tard.');
        error.code= 500;
        return next(error);
  }
  res.json({ users: users.map(user => user.toObject({ getter : true })) });
};

exports.getUserById= getUserById;
exports.getUsersByClasseId= getUsersByClasseId;
exports.signup= signup;
exports.updateUser= updateUser;
exports.deleteUser= deleteUser;
exports.login= login;
exports.getUsers= getUsers;