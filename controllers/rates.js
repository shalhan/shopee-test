const rateModel = require("../models/rates")
const helpers = require("../helpers/helpers")

// GLOBAL FUNCTION

// POST /rates
exports.createRate = function(data) {
    return new Promise(function(resolve,reject) {
        //move data to array to using parameterized query
        var arr = [data.from_c.toUpperCase(), data.to_c.toUpperCase(), data.rate, data.created_at]
        //send data to db
        rateModel.createRate(arr)
            .then(result=> {
                resolve(result)
            })
            .catch(err => {
                reject(err)
            })
    });
}

// GET /rates?date=
exports.getRatesOnDate = function(onDate) {
    return new Promise(async (resolve,reject) => {
        try{
            var rateData = await rateModel.getRateOnInterval(onDate,7)
            var averageRate = await getAverageRate(rateData,onDate, 7)
            resolve(averageRate)
        }
        catch(e)
        {
            reject(e)
        }
    })
} 

// GET /rates/recent?from=&to=
exports.getTrendData = function(queryFrom, queryTo) {
    return new Promise(async (resolve,reject) => {
        try {
            var queries = [queryFrom, queryTo]
            var latestDate = await rateModel.getLatestByCurrency(queries)
            if(latestDate[0] == null) 
                resolve(latestDate)
            else {
                var rateData = await rateModel.getRateOnInterval(latestDate[0].date_at, 7, queries)
                var trendData = await getTrendData(rateData)
                resolve(trendData)
            }
            
        }
        catch(e) {
            reject(e)
        }
    })
}

// ================ LOCAL FUNCTION ========================== //

// processing value for GET /rates?date=
// return value can be seen by accessing endpoint
function getAverageRate(rateArr, onDate, interval) {
    return new Promise(async (resolve,reject) => {
       try{
           var countedData = await countDataAverage(rateArr, onDate, interval)
           var resultData = await getDataAverage(countedData)
           var sortedData = await helpers.sortBy(resultData, "avg_rate") //desc
           resolve(sortedData)
       }
       catch(e){
           reject(e)
       }
   })
}

// processing value for GET /rates/recent?from=&date=
// return value can be seen by accessing endpoint
function getTrendData(rateArr) {
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

// total_rate, count data, and check is data has all date on last x days 
function countDataAverage(rateArr, onDate, interval) {
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
                        date: await getDateOnInterval(onDate, interval)
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

// count average and insufficient data
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
                            obj.avg_rate = null
                            obj.rate = "Insufficient data"
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

// get date in last x days from selected date
function getDateOnInterval(onDate, interval) {
    return new Promise(function(resolve,reject) {
        var arr = []
        for(i=0;i<=interval;i++)
        {
            if(i === interval){
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

// count total_rate, max_rate, min_rate, etc
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

// count avg_rate, var_rate, etc
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