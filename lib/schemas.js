var mongoose = require('mongoose'),
    passwordHash = require('password-hash');

var commoditySchema = new mongoose.Schema({
    guid : String,
    namespace : String,
    mnemonic : String,
    fullname : String,
    cusip : String,
    fraction : Number,
    family_guid : String
});

var accountSchema = new mongoose.Schema({
    guid : String,
    account_type : String,
    parent_guid : String,
    name : String,
    description : String,
    family_guid : String
});

var splitSchema = new mongoose.Schema({
    account_guid : String,
    value_num : Number,
    value_denom : Number,
    quantity_num : Number,
    quantity_denom : Number
});

var transactionSchema = new mongoose.Schema({
    guid : String,
    currency_guid : String,
    post_date : Date,
    enter_date : Date,
    description : String,
    family_guid : String,
    splits : [ splitSchema ]
});

var privilegeSchema = new mongoose.Schema({
    method : String,
    url : String
});

var userSchema = new mongoose.Schema({
    username : String,
    password : String,
    fullname : String,
    family_guid : String,
    privileges : [ privilegeSchema ]
});

userSchema.statics.checkSchemaByUser = function(username, password, url, cb) {
    this.find(function(err, users) {
        var i = users.length;
        if(i == 0)
            return cb(null, ['GET', 'POST', 'HEAD', 'PUT', 'DELETE']);
        while(i--) {
            var user = users[i];
            if(user.username == username) {
                if(!passwordHash.verify(password, user.password))
                    return cb("Password doesn't match");
                var n = user.privileges.length,
                    retArr = [];
                while(n--) {
                    new RegExp(user.privileges[n].url).test(url) &&
                        retArr.push(user.privileges[n].method);
                }
                return cb(null, retArr);
            }
        }
        return cb("No such user");
    });
};

module.exports = {
    commoditySchema : commoditySchema,
    accountSchema : accountSchema,
    transactionSchema : transactionSchema,
    userSchema : userSchema
};