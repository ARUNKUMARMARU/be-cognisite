require('dotenv').config();

const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;
const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD; 
const BASE_URL = process.env.BASE_URL;

module.exports = {
    PORT,
    JWT_SECRET,
    MONGODB_URI,
    USER_EMAIL,
    USER_PASSWORD,
    BASE_URL
}