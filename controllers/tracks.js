const trackModel = require("../models/tracks")

exports.getTracks = function() {
    return new Promise(async(resolve,reject) => {
        trackModel.getTracks()
            .then(response=> {
                resolve(response)
            })
            .catch(err => {
                reject(err)
            })
    })
}

exports.createTrack = function(data) {
    return new Promise(async(resolve,reject) => {
        var isCurrencyExist = await trackModel.isCurrencyExist([data.from_c.toUpperCase(),data.to_c.toUpperCase()])
        if(isCurrencyExist)
        {
            var isTrackingExist = await trackModel.isTrackingExist([data.from_c.toUpperCase(),data.to_c.toUpperCase()])
            if(!isTrackingExist)
            {
                try {
                    trackModel.createTrack([data.from_c.toUpperCase(),data.to_c.toUpperCase()])
                        .then(result => {
                            res = {
                                code: 1,
                                msg: "Success",
                                data: result
                            }
                            resolve(res)
                        })
                        .catch(err => {
                            reject(err)
                        })
                }
                catch(e) {
                    reject(e)
                }
            }
            else {
                res = {
                    code: 1,
                    msg: "Already exist",
                    data: []
                }
                reject(res)
            }

        }
        else {
            res = {
                code: 0,
                msg: "Currency not exist in rates table",
            }
            reject(res)
        }
    });
}

exports.deleteTrack = function(id) {
    return new Promise(async(resolve,reject) => {
        trackModel.deleteTrack([id])
            .then(result=> {
                resolve(result)
            })
            .catch(err => {
                reject(err)
            })
    })
}