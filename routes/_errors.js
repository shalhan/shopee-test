const helpers = require("../helpers/response")


exports.notFound = function(req, res){
    var response = helpers.getResponse(0,404,"End point not found")
    res.send(response);
}