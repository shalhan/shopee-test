var trackRoute = require('./_tracks')
var rateRoute = require('./_rates')
var errorRoute = require('./_errors')

exports.init = function (app) {
    app.get('/rates', rateRoute.get)
    app.get('/rates/trend', rateRoute.getTrend)
    app.post('/rates', rateRoute.create)

    app.get('/tracks', trackRoute.get)
    app.post('/tracks', trackRoute.create)
    app.delete('/tracks/:id', trackRoute.delete)

    //ERROR PAGE
    app.get('*', errorRoute.notFound)
}