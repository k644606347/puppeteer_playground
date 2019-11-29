const { makeController } = require('./makeController');

let ErrorHandler = makeController({
    logErrors: {
        action(err, req, res, next) {
            console.error(err.stack);
            next(err);
        },
        method: 'all',
    },
    clientErrorHandler(err, req, res, next) {
        if (req.xhr) {
            res.status(500).send(tools.JSONOut(1, err + ''));
        } else {
            next(err);
        }
    },
    errorHandler(err, req, res, next) {
        res.status(500);
        res.render("error", { error: err });
    }
});

module.exports = {
    ErrorHandler
}