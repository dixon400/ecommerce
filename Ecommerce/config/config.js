require('dotenv').config();

const config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    SECRET: process.env.SECRET,
    JWT_SECRET: process.env.JWT_SECRET
}

module.exports = config;