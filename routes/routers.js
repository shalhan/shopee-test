var trackRoute = require('./_tracks')
var rateRoute = require('./_rates')

exports.init = function (app) {
    app.get('/rates', rateRoute.get);
    app.post('/rates', rateRoute.create);
    app.put('/rates', rateRoute.edit);
    app.delete('/rates', rateRoute.delete);


    app.get('/tracks', trackRoute.get);
    app.post('/tracks', trackRoute.create);
    app.put('/tracks', trackRoute.edit);
    app.delete('/tracks', trackRoute.delete);

}