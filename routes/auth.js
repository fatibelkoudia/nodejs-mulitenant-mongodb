const express = require('express');
const User = require('../models/user');
const router = express.Router();

router.get('/login',function(req,res){
    res.send({type:'GET'})
});

router.post('/login',function(req,res){
    User.create(req.body).then(function(user){
          res.send(user);
    });
});

router.put('/login/:id',function(req,res){
    res.send({type:'PUT'})
});

router.delete('/login/:id',function(req,res){
    res.send({type:'DELETE'})
});



module.exports = router;
