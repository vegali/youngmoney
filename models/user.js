var mongodb = require('./db');

function User(user){
    this.name = user.name;
    this.password = user.password;
};

module.exports = User;

User.prototype.save = function(callback) {//�洢�û���Ϣ
    //Ҫ�������ݿ���û��ĵ�
    var user = {
        name: this.name,
        password: this.password,
    };
    //�����ݿ�
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        //��ȡ users ����
        db.collection('users', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //���û����ݲ��� users ����
            collection.insert(user,{safe: true}, function(err, user){
                mongodb.close();
                callback(err, user);//�ɹ������ز�����û���Ϣ
            });
        });
    });
};

User.get = function(name, callback){//��ȡ�û���Ϣ
    //�����ݿ�
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        //��ȡ users ����
        db.collection('users', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //�����û��� name ֵΪ name�ĵ�
            collection.findOne({
                name: name
            },function(err, doc){
                mongodb.close();
                if(doc){
                    var user = new User(doc);
                    callback(err, user);//�ɹ������ز�ѯ���û���Ϣ
                } else {
                    callback(err, null);//ʧ�ܣ�����null
                }
            });
        });
    });
};