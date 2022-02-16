const mongoose = require('mongoose');
const Schema= mongoose.Schema;
const uniqueValidator= require('mongoose-unique-validator');

const userSchema= new Schema({
    //pas besoin d'id, mongodb le fait auto
    nom:{type: String, required:true},
    prenom:{type: String, required:true},
    email:{type: String, unique: true, required:true},
    mdp:{type: String, required:true},
    classe_user:{type: mongoose.Types.ObjectId , ref: 'Classe'},
    role:{type: String, required:true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User',userSchema);// User is the collection name