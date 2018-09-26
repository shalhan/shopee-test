const database = require("../tools/database.js")
const pool = database.connectDB()

//processing POST /rates
//create currency exchange rate
exports.createRate = function(data) {
    return new Promise(function(resolve,reject) {
        var query = "insert into rates(from_c, to_c, rate, created_at, updated_at) values ($1, $2, $3, $4, now()) RETURNING *;"
        database.executeQuery(query, pool, data)
            .then(response=> {
                resolve(response)
            })
            .catch(err => {
                reject(err)
            })
    })
}

//get last x days rate from selected date
//return
exports.getRateOnInterval = function(onDate = null, interval, queryArr = [null,null]) {
    return new Promise(async(resolve,reject) => {
        try{
            var query = rateDataOnIntervalQuery(queryArr,onDate, interval)
            
            if(queryArr[0] == null || queryArr[1] == null)
                var rateArr =  await database.executeQuery(query, pool)
            else
                var rateArr =  await database.executeQuery(query, pool, queryArr)

            resolve(rateArr)
        }
        catch(e) {
            reject(e)
        }
    })
}

//return latest created_at for selected "from" and "to" 
exports.getLatestDate = function(queryArr) {
    return new Promise(async(resolve, reject) => {
        try{
            var query = "select created_at, to_char(created_at, 'YYYY-MM-DD') as date_at from rates where from_c = $1 and to_c = $2 order by created_at desc limit 1"
            var rateArr =  await database.executeQuery(query, pool, queryArr)
            resolve(rateArr)
        }
        catch(e) {
            reject(e)
        }
    })
}


//QUERY
var rateDataOnIntervalQuery = function(queries,onDate, interval) {
    //queries[0] = from && queries[1] = to
    if(queries[0] != null & queries[1] != null)
        whereQuery = " and from_c = $1 and to_c = $2 "
    else
        whereQuery = ""

    return "with exchange as ( "+
            "select from_c,to_c,rate,created_at "+
            "from "+
                "rates b "+
            "order "+
                "by created_at "+
        ") "+
        "select  "+
            "from_c, "+
            "to_c, "+
            "rate, "+
            "to_char(created_at, 'YYYY-MM-DD') as date_at "+
        "from "+
            "exchange "+
        "where '"+
            onDate +"' - created_at <" + interval + " and '"+
            onDate +"' - created_at >= 0 "+
            whereQuery +
        "order by "+
            "created_at desc "
}