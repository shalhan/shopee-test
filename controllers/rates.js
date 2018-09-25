const rateModel = require("../models/rates")

// GLOBAL FUNCTION

// POST /rates
exports.createRate = function(data) {
    return new Promise(function(resolve,reject) {
        //move data to array to using parameterized query
        var arr = [data.from_c, data.to_c, data.rate, data.created_at]
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
            var rateData = await rateModel.getLast7DaysRate([null,null],onDate)
            var averageRate = await rateModel.getAverageRate(rateData,onDate)
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
            var latestDate = await rateModel.getLatestDate(queries)
            if(latestDate[0] == null) 
                resolve(latestDate)
            else {
                var rateData = await rateModel.getLast7DaysRate(queries, latestDate[0].date_at)
                var trendData = await rateModel.getExchangeRateTrend(rateData)
                resolve(trendData)
            }
            
        }
        catch(e) {
            reject(e)
        }
    })
}


