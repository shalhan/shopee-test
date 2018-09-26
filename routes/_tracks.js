const trackController = require("../controllers/tracks")

const helpers = require("../helpers/response")

exports.get = function(req, res, next) {
    trackController.getTracks()
        .then(result=> {
            var response = helpers.getResponse(1, 201, "Success", result)
            res.send(response)
        })
        .catch(err => {
            var response = helpers.getResponse(0, 500, "Server error")
            res.send(err)
        })
}

exports.create = function(req, res, next) {
    var data = req.body
    let isValid = isCreateDataValid(data) 
    if(isValid.code == 1){
        trackController.createTrack(data)
            .then(result=> {
                var response = helpers.getResponse(result.code, 201, result.msg, result.data)
                res.send(response)
            })
            .catch(err => {
                if(err.msg)
                    var response = helpers.getResponse(0, 500, err.msg)
                else
                    var response = helpers.getResponse(0, 500, "Server error")
                res.send(response)
            })
    }   
    else {
        var response = helpers.getResponse(0, 400, isValid.msg)
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
    var res = {}
    if(!data.from_c  || !data.to_c)
        res = {
            code: 0,
            msg: "Missing fields"
        }
    else if(data.from_c.length > 5 || 
            data.to_c.length > 5 || 
            typeof data.from_c !== 'string' ||
            typeof data.to_c !== 'string')
        res = {
            code: 0,
            msg: "Invalid fields"
        }
    else
        res = {
            code: 1,
            msg: "Success"
        }
    return res
}