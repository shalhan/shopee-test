const rateController = require("../controllers/rates")
const helpers = require("../helpers/response")

exports.get = function(req, res, next) {
    var onDate = req.query.date
    if(isAllQueryExist([onDate])) {
        rateController.getRatesOnDate(onDate)
            .then(response => {
                res.send(response)
            })
            .catch(err=> {
                res.send(err)
            });
    }
    else {
        var response = helpers.getResponse(0, 400, "Missing query")
        res.send(response)
    }
}

exports.create = function(req, res, next) {
    var data = req.body
    if(isCreateDataValid(data)){
        rateController.createRate(data)
            .then(result => {
                var response = helpers.getResponse(1, 201, "Success")
                res.send(response)
            })
            .catch(err => {
                var response = helpers.getResponse(0, 400, "Missing fields")
                res.send(response)
            })
    }
    else {
        var response = helpers.getResponse(0, 400, "Missing fields")
        res.send(response)
    }
}

exports.edit = function(req, res, next) {
}

exports.delete = function(req, res, next) {
}

exports.getTrend = function(req, res, next) {
    var queryFrom =req.query.from
    var queryTo = req.query.to

    if(isAllQueryExist([queryFrom,queryTo])){
        rateController.getTrendData(queryFrom, queryTo)
            .then(result => {
                console.log(result)
                if(result.length == 0)
                    var response = helpers.getResponse(1, 200, "Empty data", result)
                else
                    var response = helpers.getResponse(1, 200, "Success", result)

                res.send(response)
            })
            .catch(err => {
                res.send(err)
            })
    }
    else {
        var response = helpers.getResponse(0, 400, "Query missing")
        res.send(response)
    }
}


// LOCAL FUNCTION

// validation when request /rates/recent?from=&to=
function isAllQueryExist(queries) {
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
    if(!data.from_c  || !data.to_c || !data.rate || !data.created_at)
        return false
    return true
}