var mongodb = require('./db');

var BillType = function(username,billtype){
    this.user = username;
    this.billtype = billtype;
};

module.exports = BillType;

BillType.prototype.save = function(callback){
    var billtype = {
        user : this.user,
        billtype : this.billtype
    };
    mongodb.open(function(err,db){
        if(err){
            mongodb.close();
            return callback(err);
        }
        db.collection('bill_type', function(err, collection){
            if(err){
                mongdb.close();
                return callback(err);
            }
            collection.ensureIndex('user');
            collection.insert(billtype,{sate:true},function(err,billtype){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(err,billtype);
            });
        });

/*
        //读取bill集合
        db.collection('bills',function(err,collection){
            if(err){
                mongdb.close();
                return callback(err);
            }
            //为user属性添加索引
            collection.ensureIndex('user');
            //写入bill文档
            collection.insert(bill,{safe:true},function(err,bill){
                mongdb.close();
                if(err){
                    return callback(err);
                }
                return callback(err,bill);
            });
        });
*/
    });
};

BillType.get = function(username,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('billtype',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if(username){
                query.user = username;
            }
            collection.find(query).sort({time:-1}).toArray(function(err,docs){
                mongodb.close();
                if(err){
                    callback(err);
                }
                var billtypes = new Array();
                docs.forEach(function(doc,index){
                    var billtype = new BillType(doc.user,doc.billtype);
                    billtypes.push(billtype)
                });
                callback(err,billtypes);
            })
        })
    });
};