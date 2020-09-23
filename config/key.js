const { model } = require("mongoose");

module.exports = {
    Port: 4000,
    MongoURI: 'mongodb://localhost/mongoproject',
    Secret: '3e6407cb62e2ca67a3d099cdb55d2c1598f2358e99771ebcfc91b95c7a108e374ea1e0338a6896f4f37c59b6f8d64e663101d96554bbbd31747a57c1065f71ff',
    Refresh_secret: 'b07879f0bbbdff0cd7aebd1937e9622e60181fcff2fbe05fbab4ca11cb562b9ce5e568417860b3f6f8384e965f5bfbddf2ee02e7799c1eadca9125ef7c3655a4',
    JWT_EXPIRES: '14d',
    JWT_EXPIRATION_NUM: 14 * 1000 * 60 * 60 * 24

};