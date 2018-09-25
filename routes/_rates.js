const rateController = require("../controllers/rates")

exports.get = function(req, res, next) {
    var onDate = req.query.date

    rateController.getRatesOnDate(onDate)
        .then(response => {
            res.send(response)
        })
        .catch(err=> {
            res.send(err)
        });
}

exports.create = function(req, res, next) {
    var data = req.body

    rateController.createRate(data)
        .then(response => {
            res.send(response)
        })
        .catch(err => {
            res.send(err)
        })
}

exports.edit = function(req, res, next) {
    
}

exports.delete = function(req, res, next) {
    
}

exports.getTrend = function(req, res, next) {
    var queryFrom =req.query.from
    var queryTo = req.query.to
    rateController.getTrendData(queryFrom, queryTo)
        .then(response => {
            res.send(response)
        })
        .catch(err => {
            res.send(err)
        })
}