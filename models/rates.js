const database = require("../tools/database.js")
const helpers = require("../helpers/helpers")
const pool = database.connectDB()

const DAYS = 7

exports.createRate = function(data) {
    return new Promise(function(resolve,reject) {
        var query = "insert into rates(from_c, to_c, rate, created_at, updated_at) values ($1, $2, $3, $4, now());"

        database.executeQuery(query, pool, data)
            .then(res=> {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

exports.getLast7DaysRate = function getLast7DaysRate(data) {
    return new Promise(async (resolve,reject) => {
        var query = "select id,from_c,to_c,rate,created_at from rates where created_at > $1 order by created_at desc"
        var result = await database.executeQuery(query, pool, data)
        var totalLast7Days = await getTotalLast7Days(result)
        var avgLast7Days = await getAvgLast7Days(totalLast7Days)
        resolve(avgLast7Days)
    })
}

// LOCAL FUNCTION
function getTotalLast7Days(last7DaysData) {
    // return [
    //  "from_c, to_c":  {from_c, to_c, rate, total_rate, count}
    // ]
    // not final data, only to get total rate & total date
    return new Promise(async(resolve,reject)=> {
        let length = last7DaysData.length
        var map = []
        for(let i = 0; i<=length; i++)
        {
            if(i === length){
                resolve(map)
            }
            else{
                var obj = await helpers.getDataArray(last7DaysData[i])
                var key = [obj.from_c, obj.to_c]
                if(typeof map[key] === 'undefined'){
                    map[key] = {
                        from_c: obj.from_c,
                        to_c: obj.to_c,
                        rate: obj.rate,
                        total_rate: obj.rate,
                        count: 1,
                    }
                }
                else{
                    map[key].total_rate += obj.rate
                    map[key].count+= 1
                }
            }
        }
    })
    
}

function getAvgLast7Days(totalLast7Days) {
    //return
    // [
    //   {from_c, to_c, rate, last_7_days_avg}
    // ]
    // data for frontend
    
    //add more key to stop iteration
    var moreKey = "STOP"
    totalLast7Days[moreKey] = {}
    return new Promise(async(resolve,reject)=> {
        var result = []
        let i = 0
        var length = totalLast7Days.length
        for(let key in totalLast7Days) {
            if(key === moreKey)
                resolve(result)
            else{
                var obj = await helpers.getDataArray(totalLast7Days[key])
                if(obj.count < DAYS) 
                    result.push({
                        from_c: totalLast7Days[key].from_c,
                        to_c: totalLast7Days[key].to_c,
                        rate: "insufficient data",
                        last_7_days_avg: null
                    })      
                else  
                    result.push({
                        from_c: totalLast7Days[key].from_c,
                        to_c: totalLast7Days[key].to_c,
                        rate: totalLast7Days[key].rate,
                        last_7_days_avg: totalLast7Days[key].total_rate / totalLast7Days[key].count 
                    })
            }
        }
    })
}


