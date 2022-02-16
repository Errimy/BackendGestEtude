const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userroutes = require('./routes/userroutes');
const classeroutes = require('./routes/classeroutes');
const emploiroutes = require('./routes/emploiroutes');
const examenroutes = require('./routes/examenroutes');
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  
    next();
});


app.use('/api/users',userroutes);
app.use('/api/classes',classeroutes);
app.use('/api/emplois',emploiroutes);
app.use('/api/examens',examenroutes);

app.use((error,req,res,next)=> {
    if (res.headerSent){
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message:error.message || 'Une erreur s\'est produite '});
});

mongoose
    .connect('mongodb+srv://hatim:hatim123@cluster0.ybcli.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(()=>{
        app.listen(5000);
    })
    .catch(err=>{
        console.log(err);
    });
