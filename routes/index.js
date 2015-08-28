var express = require('express');
var router = express.Router();
var Bill = require('../models/bill');
var User = require('../models/user');
var BillType = require('../models/bill_type');

router.get('/',function(req,res){
    if(req.session.user){//登录
        User.get(req.session.user.name,function(err,user){
            Bill.get(req.session.user.name,function(err,bills){//获取用户消费记录
                if(err){
                    req.flash('error',err);
                    return res.redirect('/')
                }
                BillType.get(req.session.user.name,function(err,billType){//获取用户消费类型
                    res.render('bill',{title:user.name,bills:bills,billType:billType,action:'/'})
                });
            });
        });
    }else{//未登录
        res.render('index',{title:'首页'})
    }
});

router.post('/',function(req,res){
    if(req.body.bill == "" || req.body.billtype == ""){
        req.flash('error','输入框不能为空。');
        return res.redirect('back');
    }
    var currentUser = req.session.user;
    var bill = new Bill(currentUser.name,req.body.bill,req.body.billtype);
    bill.save(function(err){
        if(err){
            req.flash('error',err);
            return res.redirect('/');
        }
        req.flash('success','发表成功。');
        res.redirect('/');
    })
});

//router.get('/u/:user',function(req,res){
//    User.get(req.params.user,function(err,user){
//        if(!user){
//            req.flash('error','用户不存在');
//            return res.redirect('back');
//        }
//        Bill.get(user.name,function(err,bills){
//            if(err){
//                req.flash('error',err);
//                return res.redirect('/')
//            }
//            res.render('bill',{title:user.name,bills:bills,action:'/'})
//        });
//    })
//});

module.exports = router;