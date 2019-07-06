const env = require('dotenv');
env.config()

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  }
});
module.exports = knex;
//here I am creating the databse if it is not exists
knex.raw('CREATE DATABASE IF NOT EXISTS zomato_clone_db')
  .then((data) => {
    console.log('Databse created congo.....');
  })
  .catch((err) => {
    console.log("there is some error while crating the database",err);
  })
// here I am creating the table.
knex.schema.hasTable('users').then((exists) => {
  if (!exists) {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('username', 100).notNullable();
        table.string('email',55).unique().notNullable();
        table.string('password',100).notNullable();
        table.string('verified').notNullable();
        table.string('created');
      })
      .catch((err) => {
        console.log("There is some err while writing the quety")
      })
  }
  return console.log('table is created!')
})
