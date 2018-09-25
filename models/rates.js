const database = require("../tools/database.js")
const helpers = require("../helpers/helpers")
const pool = database.connectDB()

const DAYS_COUNT = 7

exports.get = function() {
    return new Promise(function(resolve,reject) {

    })
}

//processing POST /rates
//create currency exchange rate
exports.createRate = function(data) {
    return new Promise(function(resolve,reject) {
        var query = "insert into rates(from_c, to_c, rate, created_at, updated_at) values ($1, $2, $3, $4, now());"
        database.executeQuery(query, pool, data)
            .then(response=> {
                resolve(response)
            })
            .catch(err => {
                reject(err)
            })
    })
}

//processing value for GET /rates/recent?from=&date=
//return value can be seen by accessing endpoint
exports.getExchangeRateTrend = function(rateArr) {
    var map = []
    return new Promise(async(resolve,reject) => {
        try{
            var countedData = await countTrendData(rateArr)
            var dataTrend = await getDataTrend(countedData)
            resolve(dataTrend)
        }
        catch(e) {
            reject(e)
        }
    })
}
//processing value for GET /rates?date=
//return value can be seen by accessing endpoint
exports.getAverageRate = function(rateArr, onDate) {
     return new Promise(async (resolve,reject) => {
        try{
            var countedData = await countDataAverage(rateArr, onDate)
            var resultData = await getDataAverage(countedData)
            resolve(resultData)
        }
        catch(e){
            reject(e)
        }
    })
}

//get last 7 days rate from selected date
//return
exports.getLast7DaysRate = function(queryArr = [null,null], onDate = null) {
    return new Promise(async(resolve,reject) => {
        try{
            var query = getLast7DaysOnDateQuery(queryArr,onDate)
            
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

//LOCAL FUNCTION

//total_rate, count data, and check is data has all date on last 7 days 
function countDataAverage(rateArr, onDate) {
    var map = []

    return new Promise(async(resolve,reject) => {
        let length = rateArr.length
        for(let i = 0; i<=length; i++)
        {
            if(i == length)
            {
                resolve(map)
            }
            else{
                let obj = await helpers.getDataArray(rateArr[i])
                let key = [obj.from_c, obj.to_c]
                if(typeof map[key] === 'undefined'){
                    map[key] = {
                        from_c: obj.from_c,
                        to_c: obj.to_c,
                        rate: obj.rate,
                        total_rate: obj.rate,
                        count:1,
                        created_at: obj.date_at,
                        date: await getLast7DaysDateMap(onDate)
                    }
                    map[key].date[obj.date_at] = 1
                }else{
                    if(typeof map[key].date[obj.date_at] !== 'undefined' ){
                        map[key].date[obj.date_at] = 1
                        map[key].count++
                        map[key].total_rate += obj.rate
                    }
                }
            }
        }
    })
}

//count average and insufficient data
function getDataAverage(rateArr) {
    return new Promise(async(resolve,reject) => {
        //add dummy data to stop iteration
        rateArr["STOP"] = {}
        for(let index in rateArr)
        {
            if(index == "STOP")
            {
                delete rateArr["STOP"]
                resolve(Object.values(rateArr))
            }
            else {
                let obj = await helpers.getDataArray(rateArr[index])
                //add dummy data to stop iteration
                obj.date["STOP"] = 0

                for(let key in obj.date)
                {
                    if(key == "STOP")
                    {
                        obj.avg_rate = obj.total_rate / obj.count
                        delete obj.total_rate
                        delete obj.count
                        delete obj.date 
                        break;
                    } else {

                        if(obj.date[key] == 0)
                        {
                            obj.avg_rate = "Insufficient data"
                            obj.rate = null
                            delete obj.total_rate
                            delete obj.count
                            delete obj.date  
                            break
                        }
                    }
                }
            }
        }
    })
}

//count total_rate, max_rate, min_rate, etc
function countTrendData(rateArr) {
    return new Promise(async(resolve,reject) => {
        let length = rateArr.length
        //init first value
        let obj = await helpers.getDataArray(rateArr[0])
        var rateObj = {
            from_c: obj.from_c,
            to_c: obj.to_c,
            total_rate: obj.rate,
            var_rate: 0,
            avg_rate: 0,
            count: 1,
            max_rate: obj.rate,
            min_rate: obj.rate,
            last_7_days: [{
                rate: obj.rate,
                created_at: obj.date_at
            }]
        }

        for(let i = 1; i<=length; i++)
        {
            if(i == length)
            {
                resolve(rateObj)
            }
            else{
                let obj = await helpers.getDataArray(rateArr[i])
                rateObj.total_rate += obj.rate
                rateObj.count++
                if(rateObj.max_rate < obj.rate)
                    rateObj.max_rate = obj.rate
                if(rateObj.min_rate > obj.rate)
                    rateObj.min_rate = obj.rate
                rateObj.last_7_days.push({
                    rate: obj.rate,
                    created_at: obj.date_at
                })
            }
        }
    })
}

//count avg_rate, var_rate, etc
function getDataTrend(rateObj) {
    return new Promise(function(resolve,reject) {
        rateObj.avg_rate = rateObj.total_rate / rateObj.count
        rateObj.var_rate = rateObj.max_rate - rateObj.min_rate
        delete rateObj.total_rate
        delete rateObj.count
        delete rateObj.max_rate
        delete rateObj.min_rate
        resolve(rateObj)
    })
}

//get date in last 7 days from selected date
function getLast7DaysDateMap(onDate) {
    return new Promise(function(resolve,reject) {
        var arr = []
        for(i=0;i<=DAYS_COUNT;i++)
        {
            if(i === DAYS_COUNT){
                resolve(arr)
            }
            else {
                var onDateTime = new Date(onDate).getTime()
                var dateTime = new Date(onDateTime - (i*60*60*24*1000))
                let month = (dateTime.getMonth()+1 ) + ""
                if(month.length == 1)
                    month = "0"+month

                var date = dateTime.getFullYear() + "-"+ month + "-" +dateTime.getDate()
                arr[date] = 0
            }
        }
    })
}

//QUERY
var getLast7DaysOnDateQuery = function(queries,onDate) {
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
            onDate +"' - created_at < 7 and '"+
            onDate +"' - created_at >= 0 "+
            whereQuery +
        "order by "+
            "created_at desc "
}