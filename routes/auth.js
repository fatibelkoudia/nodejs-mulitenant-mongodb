const express = require('express');
const router = express.Router();

router.get('/login',function(req,res){
    res.send({type:'GET'})
});

router.post('/login',function(req,res){
    console.log(req.body);
    res.send({
        type:'POST',
        name:req.body.name,
        lvl:req.body.lvl
    })
});

router.put('/login/:id',function(req,res){
    res.send({type:'PUT'})
});

router.delete('/login/:id',function(req,res){
    res.send({type:'DELETE'})
});



module.exports = router;
