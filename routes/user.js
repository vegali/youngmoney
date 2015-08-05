var express = require('express');
var router = express.Router();

router.get('/',function(req,res){
    res.send('用户首页');
});

/*--------------------------------------------------------------注册*/
router.get('/reg',function(req,res){
    res.render('user/reg',{title:'用户注册',action:'/user/reg'});
});
router.post('/reg',function(req,res){
    if(!req.body.username || !req.body.password){
        req.flash('error','用户名密码不能为空。');
        return res.redirect('back');
    }
    if(req.body.password != req.body.passwordRepeat){
        req.flash('error','两次输入密码不一致，请重新输入。');
        return res.redirect('back');
    }
});

/*--------------------------------------------------------------登录*/
router.get('/login',function(req,res){
    res.render('user/reg',{title:'用户登录',action:'/user/login'});
});
router.post('/login',function(req,res){
    if(!req.body.username || !req.body.password){
        req.flash('error','用户名密码不能为空');
        return res.redirect('back');
    }
});

module.exports = router;