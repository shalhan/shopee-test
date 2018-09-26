const rateController = require("../controllers/rates")
const helpers = require("../helpers/response")

exports.get = function(req, res, next) {
    var onDate = req.query.date
    if(isQueryExist([onDate])) {
        if(isDateValid(onDate))
        {
            rateController.getRatesOnDate(onDate)
                .then(result => {
                    var response = helpers.getResponse(1, 201, "Success", result)

                    res.send(response)
                })
                .catch(err=> {
                    var response = helpers.getResponse(0, 500, "Server error")
                    res.send(response)
                });
        }
        else {
            var response = helpers.getResponse(0, 400, "Data must be date format 'YYYY-MM-DD'")
            res.statusCode = 400
            res.send(response)
        }
    }else {
        var response = helpers.getResponse(0, 400, "Missing query")
        res.statusCode = 400
        res.send(response)
    }
}

exports.create = function(req, res, next) {
    var data = req.body
    var isValid = isCreateDataValid(data) 
    if(isValid.code == 1){
        rateController.createRate(data)
            .then(result => {
                var response = helpers.getResponse(1, 201, "Success", result)
                res.send(response)
            })
            .catch(err => {
                var response = helpers.getResponse(0, 400, "Missing fields")
                res.send(response)
            })
    }
    else {
        var response = helpers.getResponse(0, 400, isValid.message)
        res.statusCode = 400
        res.send(response)
    }
}

exports.getTrend = function(req, res, next) {
    var queryFrom =req.query.from
    var queryTo = req.query.to

    if(isQueryExist([queryFrom,queryTo])){
        rateController.getTrendData(queryFrom, queryTo)
            .then(result => {
                if(result.length == 0)
                    var response = helpers.getResponse(1, 201, "Empty data", result)
                else
                    var response = helpers.getResponse(1, 201, "Success", result)

                res.send(response)
            })
            .catch(err => {
                res.send(err)
            })
    }
    else {
        var response = helpers.getResponse(0, 400, "Query missing")
        res.statusCode = 400
        res.send(response)
    }
}


// LOCAL FUNCTION

// validation when request /rates/recent?from=&to=
function isQueryExist(queries) {
    let length = queries.length
    for(let i = 0; i<=length; i++)
    {   
        if(i === length)
            return true

        if(!queries[i])
            return false
    }
}
// validation when create currency exchange rate
function isCreateDataValid(data) {
    let res = {}
    if( !data.from_c  || !data.to_c || !data.rate || !data.created_at )
        res = {
            code: 0,
            message: "Missing field!"
        }
    else if( data.from_c.length > 5 || data.to_c.length > 5 || !isDateValid(data.created_at) )
        res = {
            code: 0,
            message: "Invalid field!"
        }
    else 
        res = {
            code: 1,
            message: "Valid"
        }
    
    
    return res
}

function isDateValid(date)
{
    let dateReg = /^\d{4}[./-]\d{2}[./-]\d{2}$/
    return date.match(dateReg)
}