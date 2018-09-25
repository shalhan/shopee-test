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
        var isCurrencyExist = await trackModel.isCurrencyExist([data.from_c,data.to_c])
        if(isCurrencyExist)
        {
            var isTrackingExist = await trackModel.isTrackingExist([data.from_c,data.to_c])
            if(!isTrackingExist)
            {
                try {
                    trackModel.createTrack([data.from_c,data.to_c])
                        .then(result => {
                            res = {
                                code: 1,
                                msg: "Success"
                            }
                            resolve(res)
                        })
                        .catch(err => {

                        })
                }
                catch(e) {
                    reject(e)
                }
            }
            else {
                res = {
                    code: 1,
                    msg: "Already exist"
                }
                resolve(res)
            }

        }
        else {

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