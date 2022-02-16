const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const emploiSchema= new Schema({
    //pas besoin d'id, mongodb le fait auto
    // [] means muliptle maybe use in emploi? IMPORTANT
    matiere: {type: String, required:true},
    jour:{type: String, required:true},// avec options lundi mardi .. samedi
    heure: {type: String, required:true}, //string mais 4 option 8-10 10-12...
    //faire une table ou fonctions qui refait cette operation 4x6 fois ou avec un forme ou hard coded... 
});

module.exports = mongoose.model('Emploi',emploiSchema);// emploi is the collection name