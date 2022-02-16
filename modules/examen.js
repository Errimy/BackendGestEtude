const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const examenSchema= new Schema({
    //pas besoin d'id, mongodb le fait auto
    matiere: {type: String, required:true},
    nom_etudiant :{type: String, required:true},//etudiant par etudiant? ou classe liste classe ? UGH
    note :{type: Number ,min:0, max:20 , required:true}, // max 20 min 0 a faire avec methode check?
    date :{ type: Date, required:true}
});

module.exports = mongoose.model('Examen',examenSchema);// Examen is the collection name