var express = require('express');
var router = express.Router();

router.get('/',function(req,res){
    res.send('用户首页');
});

router.get('/reg',function(req,res){
    res.render('user/reg',{title:'用户注册',action:'/user/reg'})
});

router.get('/login',function(req,res){
    res.send('用户登陆');
});


module.exports = router;