const rateModel = require("../models/rates")
const helpers = require("../helpers/response")

//GLOBAL FUNCTION

//POST /rates
exports.createRate = function(data) {
    return new Promise(function(resolve,reject) {
        //Validation
        if(isCreateDataValid(data))
        {
            //move data to array to using parameterized query
            var arr = [data.from_c, data.to_c, data.rate, data.created_at]
            //send data to db
            rateModel.createRate(arr)
                .then(response=> {
                    var response = helpers.getResponse(1, 201, "Success")
                    resolve(response)
                })
                .catch(err => {
                    var response = helpers.getResponse(0, 400, "Missing fields")
                    resolve(response)
                })
        }       
        else
        {
            reject("Missing fields")
        }
    });
}

//GET /rates?date=
exports.getRatesOnDate = function(onDate) {
    return new Promise(async (resolve,reject) => {
        //no query on date
        if(typeof onDate === 'undefined'){
            var response = helpers.getResponse(0, 400, "Missing query")
            reject(response)
        }
        //with query on date
        else{ 
            try{
                var rateData = await rateModel.getLast7DaysRate([null,null],onDate)
                var averageRate = await rateModel.getAverageRate(rateData,onDate)
                var response = helpers.getResponse(1, 200, "Success", averageRate)
                resolve(response)
            }
            catch(e)
            {
                reject(e)
            }
        }
    })
} 

//GET /rates/recent?from=&to=
exports.getTrendData = function(queryFrom, queryTo) {
    return new Promise(async (resolve,reject) => {
        //query exist
        if(isGetTrendDataValid(queryFrom,queryTo)) {
            try {
                var queries = [queryFrom, queryTo]
                var latestDate = await rateModel.getLatestDate(queries)
                if(latestDate[0] == null) {
                    var response = helpers.getResponse(0, 400, "Invalid queries, data not found")
                    reject(response)
                }
                else {
                    var rateData = await rateModel.getLast7DaysRate(queries, latestDate[0].date_at)
                    var trendData = await rateModel.getExchangeRateTrend(rateData)
                    var response = helpers.getResponse(1, 200, "Success", trendData)
                }
                
                resolve(response)
            }
            catch(e) {
                reject(e)
            }
        }
        else {
            var response = helpers.getResponse(0, 400, "Missing query")
            reject(response)
        }
    })
}

// LOCAL FUNCTION
//validation when create currency exchange rate
function isCreateDataValid(data) {
    if(!data.from_c  || !data.to_c || !data.rate || !data.created_at)
        return false
    return true
}

//validation when request /rates/recent?from=&to=
function isGetTrendDataValid(queryFrom, queryTo) {
    if(!queryFrom || !queryTo)
        return false
    return true
}
