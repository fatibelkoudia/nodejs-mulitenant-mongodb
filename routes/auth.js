const express = require('express');
const User = require('../models/user');
const router = express.Router();

router.get('/login',function(req,res,next){
    res.send({type:'GET'})
});

router.post('/login',function(req,res,next){
    User.create(req.body).then(function(user){
          res.send(user);
    }).catch(next);
});

router.put('/login/:id',function(req,res,next){
    res.send({type:'PUT'})
});

router.delete('/login/:userID',function(req,res,next){
    //console.log(req.params.userID)
    User.findByIdAndRemove({_id:req.params.userID}).then(function(user){
        res.send(user);
    });
});



module.exports = router;
