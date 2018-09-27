const { Pool, Client } = require('pg')
const config = require("../configs/config.json")
// const config = process.env.NODE_ENV == 'test' ?  require("../configs/config-test.json") : require("../configs/config.json")

exports.connectDB = function() {
    const pool = new Pool({
        user: process.env.DB_USER || config.db.user,
        host: process.env.DB_HOST || config.db.host,
        database: process.env.DB_NAME || config.db.database,
        password: process.env.DB_PASS || config.db.password,
        port: process.env.DB_PORT || config.db.port,
    })

    return pool
}

exports.executeQuery = function(query, pool, values) {
    return new Promise(function(resolve,reject) {
        pool.connect()
            .then(client => {
                    return client.query(query, values)
                    .then(res => {
                        client.release()
                        resolve(res.rows)
                    })
                    .catch(e => {
                        client.release()
                        reject(e)
                    })
                })
    })
}