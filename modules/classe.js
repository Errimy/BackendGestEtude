const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const classeSchema= new Schema({
    //pas besoin d'id, mongodb le fait auto
    nom_classe :{type: String, required:true},
    liste_etudiant:[{type: mongoose.Types.ObjectId , ref: 'User'}], 
    emploi_classe :{type: String, required:true}
});

module.exports = mongoose.model('Classe',classeSchema);// User is the collection name