const trackController = require("../controllers/tracks")

const helpers = require("../helpers/response")

exports.get = function(req, res, next) {
    trackController.getTracks()
        .then(result=> {
            var response = helpers.getResponse(1, 201, "Success", result)
            res.send(response)
        })
        .catch(err => {
            var response = helpers.getResponse(0, 500, "Failed")
            res.send(err)
        })
}

exports.create = function(req, res, next) {
    var data = req.body
    if(isCreateDataValid(data)){
        trackController.createTrack(data)
            .then(result=> {
                var response = helpers.getResponse(result.code, 200, result.msg)
                res.send(response)
            })
            .catch(err => {
                var response = helpers.getResponse(0, 500, "Failed")
                res.send(response)
            })
    }   
    else {
        var response = helpers.getResponse(0, 400, "Missing fields")
        res.send(response)
    }
}

exports.delete = function(req, res, next) {
    var id = req.params.id
    trackController.deleteTrack(id)
        .then(result => {
            var response = helpers.getResponse(1, 201, "Success")
            res.send(response)
        })
        .catch(err => {
            var response = helpers.getResponse(0, 500, "Failed")
            res.send(response)
        })
}

// LOCAL FUNCTION

// validation when create currency exchange rate
function isCreateDataValid(data) {
    if(!data.from_c  || !data.to_c)
        return false
    return true
}