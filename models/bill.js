var mongodb = require('./db');
var moment = require('moment');

var Bill = function(username,bill,billtype,billinfo,time){
    this.user = username;
    this.bill = bill;
    this.billtype = billtype;
    this.billinfo = billinfo;
    if(time){
        this.time = time;
    }else{
        this.time = new Date();
    }
};

module.exports = Bill;

Bill.prototype.save = function(callback){
    var bill = {
        user:this.user,
        bill:this.bill,
        billtype:this.billtype,
        billinfo:this.billinfo,
        time:this.time
    };
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }

        //读取bill集合
        db.collection('bills',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //为user属性添加索引
            collection.ensureIndex('user');
            //写入bill文档
            collection.insert(bill,{safe:true},function(err,bill){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(err,bill);
            });
        });
    });
};

Bill.get = function(username,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取bill集合
        db.collection('bills',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //查找user属性为usernamer的文档，如果user是null则匹配全部
            var query = {};
            if(username){
                query.user = username;
            }
            collection.find(query).sort({time:-1}).toArray(function(err,docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                //封装bills为Bill对象
                var bills = [];
                docs.forEach(function(doc,index){
                    var bill = new Bill(doc.user,doc.bill,doc.billtype,doc.billinfo,moment(doc.time).format("YYYY-MM-DD"));
                    bills.push(bill);
                });
                callback(null,bills);
            })
        })
    });
};