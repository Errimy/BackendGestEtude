const { validationResult } = require("express-validator");

let DUMMY_COMPTES = [
    {
        id: 'c0',
        nom: 'Errimy',
        prenom: 'Hatim',
        email: 'erh@gmail.com',
        mdp: "eruig"
    }
];

const getComptes = (req, res, next)=> {
    res.json({comptes : DUMMY_COMPTES})
};

const signup = (req, res, next)=> {
    const errors= validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('un champs important n\'est pas rempli, le mot de passe doit avoir 5 caractère minimum, et l\'adresse email doit être valide.');
        error.code= 422;
        return next(error);
    }
    const{id,nom, prenom, email, mdp}= req.body;

    const hasCompte = DUMMY_COMPTES.find( c=> c.email === email);
    if (hasCompte) {
        const error = new Error('Adresse email déjà utiliser, essayer un autre.');
        error.code= 422;
        return next(error);
    }

    const createdCompte ={
        id,
        nom, // name : name
        prenom,
        email,
        mdp
    }
    DUMMY_COMPTES.push(createdCompte);

    res.status(201).json({compte : createdCompte});
};

const login = (req, res, next)=> {
    const{email, mdp}= req.body;

    const identifiedCompte=DUMMY_COMPTES.find(c=> c.email===email);
    if (!identifiedCompte || identifiedCompte.mdp !== mdp){
        const error = new Error('Problème de connexion verifier votre email et votre mot de passe.');
        error.code= 401;
        return next(error);
    }
    res.json({message: "connexion succés."});
};

exports.getComptes= getComptes;
exports.signup= signup;
exports.login= login;