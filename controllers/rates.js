const rateModel = require("../models/rates")
const helpers = require("../helpers/response")

const LAST_SEVEN_DAY = 7 * 24 * 60 * 60 * 1000

//GLOBAL FUNCTION

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

exports.getRates = function(onDate) {
    return new Promise(async (resolve,reject) => {
        //no query on date
        if(typeof onDate === 'undefined'){
            resolve("GAK PAKE PARAMETER")
        }
        //with query on date
        else{ 
            var arr = [getLast7Days(onDate)]
            try{
                var last7DaysRate = await rateModel.getLast7DaysRate(arr)
                var response = helpers.getResponse(1, 201, "Success", last7DaysRate)
                resolve(response)
            }
            catch(e)
            {
                reject(e)
            }
        }
    })
} 


// LOCAL FUNCTION
function isCreateDataValid(data) {
    if(!data.from_c  || !data.to_c || !data.rate || !data.created_at)
        return false;
    return true;
}

function getLast7Days(onDate) {
    var dateTime = new Date(onDate).getTime()
    var last7DateTime = new Date(dateTime - LAST_SEVEN_DAY)
    return last7DateTime.getFullYear() + "-" + last7DateTime.getMonth() + "-" + last7DateTime.getDate()
}

