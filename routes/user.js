var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var User = require('../models/user');
var BillType = require('../models/bill_type');

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
        password: password
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

/*--------------------------------------------------------------用户消费类型*/
router.get('/bill_type',function(req,res){
    if(!req.session.user){
        req.flash('error','未登录。');
        return res.redirect('/user/login');
    }else{
        BillType.get(req.session.user.name,function(err,billType){//获取用户消费类型
            if(err){
                req.flash('error',err);
            }
            res.render('user/bill_type',{title:'设置消费类型',billTypes:billType,action:'/user/bill_type'})
        });
    }
});

router.post('/bill_type',function(req,res){
    if(!req.body.billType){
        req.flash('error','消费类型不能为空。');
    }
    var newBillType = new BillType(
        req.session.user.name,
        req.body.billType
    );
    //检查消费类型是否已经存在
    BillType.get(newBillType.user.user,function(err,billType){
        newBillType.save(function(err){
            if(err){
                req.flash('error',err);
                return res.redirect('/user/bill_type');
            }
            req.flash('success','添加成功');
            return res.redirect('/user/bill_type');
        })
    });


});

/*--------------------------------------------------------------判断用户是否登陆*/
function checkLogin(req,res,next){
    if(!req.session.user){
        req.flash('error','未登录。');
        return res.redirect('/login');
    }
    next();
}

module.exports = router;