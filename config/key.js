const { model } = require("mongoose");

require('dotenv').config();

module.exports = {
    Port: process.env.PORT || 4000,
    MongoURI: process.env.MONGOURI,
    Secret: process.env.SECRET,
    Refresh_secret: process.env.REFRESH_SECRET,
    JWT_EXPIRES: process.env.SESSION_EXPIRES,

};