//jshint esversion:6

require('dotenv').config();
const express= require('express');
const parser= require('body-parser');
const ejs= require('ejs');
const mongoose=require('mongoose');
const encryption=require('mongoose-encryption');


mongoose.connect('mongodb://localhost:27017/userDB',{useNewUrlParser:true, useUnifiedTopology:true});

const userSchema= new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});


userSchema.plugin(encryption,{secret: process.env.SECRET, encryptedFields: ['password']});

const User= mongoose.model('User',userSchema);

let secrets=[];

const app= express();

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(parser.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.render('home');
});
app.get('/login',(req,res)=>{
    res.render('login');
});
app.get('/register',(req,res)=>{
    res.render('register');
});
app.get('/logout',(req,res)=>{
    res.render('home');
});
app.get('/submit',(req,res)=>{
    res.render('submit');
});


app.post('/register',(req,res)=>{
    const username= req.body.username;
    const password= req.body.password;
    const newUser= new User({
        username: username,
        password: password
    });
    newUser.save((err)=>{
        if(err){
            console.log('Error');
        }else{
            res.render('secrets');
        }
    });
});

app.post('/login',(req,res)=>{
    User.findOne({
        username: req.body.username
    },(err,foundUser)=>{
        if(!foundUser){
            res.render('error');
        }
        if(foundUser){
            if(foundUser.password===req.body.password){
                res.render('secrets');
            }else{
                res.render('error');
            }
        }        
    });
});

app.post('/submit',(req,res)=>{
    const secret=req.body.secret;
    secrets.push(secret);
    res.render('secrets');
}); 






app.listen(3000,()=>{
    console.log('Server is working on port 3000');
});