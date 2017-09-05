/**
 * CarController
 *
 * @description :: Server-side logic for managing cars
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Util = require('../helpers/util');

var self = module.exports = {

    /* API */

    _create: function (car, res) {

        Car.create(car).exec(function (err, aCar) {
            if (err) return res.serverError(err);
            sails.log(`car ${aCar.id} created`);

            HostInfo.findOne(aCar.carowner).exec(function (err, aHost) {
                Util.addToArray(aHost.servicetype, "car_drive", true);
                aHost.myCar = aCar;
                aHost.save(function (err) {
                    if (err) return res.serverError(err);
                    sails.log(`${aHost.hostId} open car_drive service`);

                    return res.ok({ ok: 'ok', op: 'c' });
                });
            });
        })
    },

    _update: function (car, res) {
        Car.update({ owner: car.owner }, car).exec(function (err, record) {
            if (err) return res.serverError(err);
            sails.log(`${record.length} car(s) updated`);

            return res.ok({ ok: 'ok', op: 'u' });
        })
    },

    createOrUpdate: function (req, res) {
        var newCar = req.allParams();
        newCar['modifiedBy'] = req.session.me || 'A ghost';
        newCar['owner'] = req.param('carowner');

        Util.handleChkboxControl(req, ['forbids', 'facility', 'servicetypes'], newCar);

        Car.findOne({ owner: newCar['owner'] }).exec(function (err, record) {
            if (err) return res.serverError(err);

            if (record) {
                self._update(newCar, res);
            } else {
                self._create(newCar, res);
            }
        });
    },

    /* End API */

    /* Page */
    __g: function (req, res) {
        var id = req.param('id');

        Car.findOne(id).exec(function (err, record) {
            if (err) return res.serverError(err);

            if (record) {
                sails.log(`Find car ${record.id}`);

                res.view('car-detail', {
                    car: record,
                    ratings: {
                        overall: { name: 'overall', value: parseInt(1 + Math.random() * 5) },
                        clean: { name: 'clean', value: parseInt(1 + Math.random() * 5) },
                        infomatch: { name: 'infomatch', value: parseInt(1 + Math.random() * 5) },
                        goodlocation: { name: 'goodlocation', value: parseInt(1 + Math.random() * 5) },
                        communication: { name: 'communication', value: parseInt(1 + Math.random() * 5) },
                        goodfacility: { name: 'goodfacility', value: parseInt(1 + Math.random() * 5) },
                        goodprice: { name: 'goodprice', value: parseInt(1 + Math.random() * 5) },
                    },
                });
            } else {
                res.notFound(id);
            }
        });
    },

    ownerInfo: function (req, res) {
        var id = req.param('id');
    
        HostInfo.findOne({ hostId: id }).populate('myHouse').populate('myCar').exec(function (err, aHost) {
          if (err) return res.serverError(err);
            res.view('owner-detail', { cHost: aHost, house: aHost.myHouse, car: aHost.myCar });
        });
      },
    /* End Page */
};

