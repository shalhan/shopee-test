var trackRoute = require('./_tracks')
var rateRoute = require('./_rates')
var errorRoute = require('./_errors')

exports.init = function (app) {
    app.get('/rates', rateRoute.get)
    app.get('/rates/trend', rateRoute.getTrend)
    app.post('/rates', rateRoute.create)
    app.put('/rates', rateRoute.edit)
    app.delete('/rates', rateRoute.delete)

    app.get('/tracks', trackRoute.get)
    app.post('/tracks', trackRoute.create)
    app.put('/tracks', trackRoute.edit)
    app.delete('/tracks', trackRoute.delete)

    //ERROR PAGE
    app.get('*', errorRoute.notFound)
}