require('dotenv').config();
const mysql = require('mysql');

const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;
const pool = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
});
const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD; 
const BASE_URL = process.env.BASE_URL;

module.exports = {
    PORT,
    JWT_SECRET,
    pool,
    USER_EMAIL,
    USER_PASSWORD,
    BASE_URL
}