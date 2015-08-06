//载入处理文件
var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var mongoStore = require('connect-mongo')(session);
var settings = require('./settings');

//载入路由文件
var index = require('./routes/index');
var user = require('./routes/user');

//处理代码
var app = express();
app.set('views',path.resolve(__dirname,'views'));
app.set('view engine','html');
app.engine('html',require('ejs').renderFile);
app.use(serveStatic(path.resolve(__dirname,'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    secret:settings.cookieSecret,
    resave:true,
    saveUninitialized:true,
    key:settings.db,
    store:new mongoStore({
        db:settings.db
    })
}));
app.use(flash());
app.use(function(req,res,next){
    res.locals.user = req.session.user || '';
    res.locals.error = req.flash('error').toString() || '';
    res.locals.success = req.flash('success').toString() || '';
    next();
});


//使用路由
app.use('/',index);
app.use('/user',user);

//设备监听端口
app.listen(3000);