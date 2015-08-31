var mongodb = require('./db');

var BillType = function(username,billtype){
    this.user = username;
    this.billtype = billtype;
};

module.exports = BillType;

BillType.prototype.save = function(callback){
    var newBilltype = {
        user : this.user,
        billtype : this.billtype
    };
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取bill_type集合
        db.collection('bill_type', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.ensureIndex('user');
            collection.insert(newBilltype,{sate:true},function(err,billtype){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(err,billtype);
            });
        });
    });
};

BillType.get = function(username,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('bill_type',function(err,collection){
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
                var billtypes = [];
                docs.forEach(function(doc,index){
                    var billtype = new BillType(doc.user,doc.billtype);
                    billtypes.push(billtype)
                });
                callback(err,billtypes);
            })
        })
    });
};