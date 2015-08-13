var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var User = require('../models/user.js');

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
    //生成口令散列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    var newUser = new User({
        name: req.body.username,
        password: password,
    });
    //检查用户名是否已经存在
    User.get(newUser.name, function(err, user){
        if(user){
            err = '用户已存在!';
        }
        if(err){
            req.flash('error', err);
            return res.redirect('back');
        }
        //如果不存在则新增用户
        newUser.save(function(err){
            if(err){
                req.flash('error',err);
                return res.redirect('/reg');
            }
            req.session.user = newUser;//用户信息存入session
            req.flash('success','注册成功!');
            return res.redirect('back');
        });
    });
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

    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');

    User.get(req.body.username,function(err,user){
        if(!user){
            req.flash('error','用户名不存在');
            return res.redirect('back');
        }
        if(user.password != password){
            req.flash('error','用户名密码不匹配。');
            return res.redirect('back');
        }
        req.session.user = user;
        req.flash('success','登录成功。');
        return res.redirect('/');
    })
});

/*--------------------------------------------------------------登出*/
router.get('/logout',function(req,res){
    req.session.user = null;
    req.flash('success','退出成功');
    res.redirect('/');
});

module.exports = router;