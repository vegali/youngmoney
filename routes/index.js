var express = require('express');
var router = express.Router();
var Bill = require('../models/bill');
var User = require('../models/user');

router.get('/',function(req,res){
    res.render('index',{title:'首页',action:'/'})
});

router.post('/',function(req,res){
    var currentUser = req.session.user;
    var bill = new Bill(currentUser.name,req.body.bill);
    bill.save(function(err){
        if(err){
            req.flash('error',err);
            return res.redirect('/');
        }
        req.flash('success','发表成功。');
        res.redirect('/u/'+currentUser.name);
    })
});

router.get('/u/:user',function(req,res){
    User.get(req.params.user,function(err,user){
        if(!user){
            req.flash('error','用户不存在');
            return res.redirect('/');
        }
        console.log(User)
        console.log(Bill)
        //Bill.get(user.name,function(err,bills){
        //    console.log(bills)
        //    if(err){
        //        req.flash('error',err);
        //        return res.redirect('/')
        //    }
        //    res.render('bill',{
        //        title:user.name,
        //        bills:bills
        //    })
        //});
    })
});

module.exports = router;