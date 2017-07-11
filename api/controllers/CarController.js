/**
 * CarController
 *
 * @description :: Server-side logic for managing cars
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Util = require('../helpers/util');

var self = module.exports = {

    /* API */
    hi: function(req,res) {
        sails.log.debug(req.allParams());
    },

    _create: function (car, res) {

        Car.create(car).exec(function (err, record) {
            if (err) return res.serverError(err);

            sails.log(`car ${record.id} created`);
            return res.ok({ ok: 'ok', op:'c' });
        })
    },

    _update: function (car, res) {
        Car.update({ owner: car.owner }, car).exec(function (err, record) {
            if (err) return res.serverError(err);

            sails.log(`${record.length} car(s) updated`);
            return res.ok({ ok: 'ok', op:'u' });
        })
    },

    createOrUpdate: function (req, res) {
        var newCar = req.allParams();
        newCar['modifiedBy'] = req.session.me || 'A ghost!';
        newCar['owner'] = req.param('carowner') || req.session.me;

        Util.handleChkboxControl(req, ['forbids', 'facility', 'servicetypes'], newCar);

        House.findOne({ owner: newCar['owner'] }).exec(function (err, record) {
            if (err) return res.serverError(err);

            if (record) {
                self._update(newCar, res);
            } else {
                self._create(newCar, res);
            }
        });
    },

    /* End API */
};

