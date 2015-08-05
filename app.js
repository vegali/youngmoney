//载入处理文件
var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');

//载入路由文件
var index = require('./routes/index');
var user = require('./routes/user');

//处理代码
var app = express();
app.set('views',path.resolve(__dirname,'views'));
app.set('view engine','html');
app.engine('html',require('ejs').renderFile);
app.use(serveStatic(path.resolve(__dirname,'public')));


//使用路由
app.use('/',index);
app.use('/user',user);

//设备监听端口
app.listen(3000);