var restify = require('restify');

module.exports = exports = function(params) {
    var generateUuid = params.generateUuid, Currency = params.Currency;
    return {
        createCurrency : function(req, res, next) {
            var currency = new Currency, guid = generateUuid();
            currency.guid = req.params.id || guid;
            currency.namespace = 'CURRENCY';
            currency.mnemonic = req.params.mnemonic;
            currency.fullname = req.params.fullname;
            currency.cusip = req.params.cusip;
            currency.fraction = req.params.fraction;
            currency.save(function(err) {
                if (err)
                    return next(err);
                res.send(currency);
                return next();
            });
        },

        respondCurrency : function(req, res, next) {
            Currency.findOne({
                mnemonic : req.params.mnemonic
            }, function(err, currency) {
                if (err || currency == null)
                    return next(new restify.InvalidArgumentError(
                            "No such currency"));
                res.json(currency);
                return next();
            });
        },

        respondCurrencies : function(req, res, next) {
            Currency.find(function(err, currency) {
                res.json(currency);
            });
        },

        deleteCurrency : function(req, res, next) {
            Currency.findOneAndRemove({
                mnemonic : req.params.mnemonic
            }, function(err, currency) {
                if (err || currency == null)
                    return next(new restify.InvalidArgumentError(
                            "No such currency"));
                res.json(currency);
                return next();
            });
        }

    };
};