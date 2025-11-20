require('dotenv').config();

module.exports = {
    development: {
    username: process.env.DB_USER || 'your_username',
    password: process.env.DB_PASSWORD || 'your_password', 
    database: process.env.DB_NAME || 'your_database',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres'
  },
  test: {
    username: process.env.DB_USER || 'your_username',
    password: process.env.DB_PASSWORD || 'your_password', 
    database: process.env.DB_NAME + '_test' || 'your_database_test',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres'
  },
  production: {
    username: process.env.DB_USER || 'your_username',
    password: process.env.DB_PASSWORD || 'your_password', 
    database: process.env.DB_NAME + '_prod' || 'your_database_prod',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres'
  }
};