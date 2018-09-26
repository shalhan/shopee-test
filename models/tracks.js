const database = require("../tools/database.js")
const helpers = require("../helpers/helpers")
const pool = database.connectDB()

exports.getTracks = function(data) {
    return new Promise(async(resolve,reject) => {
        var query = "select id,from_c,to_c from tracks"
        database.executeQuery(query, pool)
            .then(result=> {
                resolve(result)
            })
            .catch(err => {
                reject(err)
            })
    })
}

exports.createTrack = function(data) {
    return new Promise(async(resolve,reject) => {
        var query = "insert into tracks(from_c, to_c, created_at, updated_at) values ($1, $2, now(), now()) RETURNING *;"
        database.executeQuery(query, pool, data)
            .then(result=> {
                resolve(result)
            })
            .catch(err => {
                reject(err)
            })
    })
}

exports.deleteTrack = function(idArr) {
    return new Promise(function(resolve,reject) {
        var query = "delete from tracks where id = $1"
        database.executeQuery(query, pool, idArr)
            .then(result=> {
                resolve(result)
            })
            .catch(err => {
                reject(err)
            })
    })
}

exports.isCurrencyExist = function(value) {
    return new Promise(async(resolve,reject) => {
        var query = "select from_c,to_c from rates where from_c = $1 and to_c = $2 limit 1"
        database.executeQuery(query, pool,value)
            .then(result=> {
                if(result.length == 1)
                    resolve(true)
                else
                    resolve(false)
            })
            .catch(err => {
                reject(err)
            })
    })
}

exports.isTrackingExist = function(value) {
    return new Promise(async(resolve,reject) => {
        var query = "select from_c, to_c from tracks where from_c = $1 and to_c = $2 limit 1"

        database.executeQuery(query, pool,value)
            .then(result=> {
                if(result.length == 1)
                    resolve(true)
                else
                    resolve(false)
            })
            .catch(err => {
                reject(err)
            })
    })
}