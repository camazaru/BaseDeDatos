const knex = require('knex')
const configmySQL = {
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'dbproductos'
    },
    pool: { min: 0, max: 7 }
}
const configSQL3 = {
    client: 'sqlite3',
    connection: { filename: `${__dirname}../../ecommerce/mysql.sqlite`, },
    useNullAsDefault: true
}
const dbConnectionmySQL = knex(configmySQL)
const dbConnectionSQL3 = knex(configSQL3)
module.exports = { dbConnectionmySQL, dbConnectionSQL3 }