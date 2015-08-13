var express = require('express');
var router = express.Router();
var Bill = require('../models/bill');

router.get('/',function(req,res){
    res.render('index',{title:'首页',action:'/'})
});

router.post('/',function(req,res){
    var currentUser = req.session.user;
    var bill = new Bill(currentUser.name,body.body.bill);
    bill.save(function(err){
        if(err){
            req.flash('error',err);
            return res.redirect('/');
        }
        req.flash('success','发表成功。');
        res.redirect('/u/'+currentUser);
    })
});


module.exports = router;