/**
 * HouseController
 *
 * @description :: Server-side logic for managing houses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Util = require('../helpers/util');

var self = module.exports = {

  /* API */

  _create: function (house, res) {

    House.create(house).exec(function (err, aHouse) {
      if (err) return res.serverError(err);
      sails.log(`house ${aHouse.id} created`);

      HostInfo.findOne(aHouse.houseowner).exec(function (err, aHost) {
        Util.addToArray(aHost.servicetype, "house4rent", true);
        aHost.myHouse = aHouse;
        aHost.save(function (err) {
          if (err) return res.serverError(err);
          sails.log(`${aHost.hostId} open house4rent service`);

          return res.ok({ ok: 'ok', op: 'c' });
        });
      });
    })
  },

  _update: function (house, res) {
    House.update({ owner: house.owner }, house).exec(function (err, record) {
      if (err) return res.serverError(err);
      sails.log(`${record.length} house(s) updated`);

      return res.ok({ ok: 'ok', op: 'u' });
    })
  },

  createOrUpdate: function (req, res) {
    var newHouse = req.allParams();
    newHouse['modifiedBy'] = req.session.me || 'A ghost';
    newHouse['owner'] = req.param('houseowner');

    Util.handleChkboxControl(req, ['forbids', 'facility'], newHouse);

    House.findOne({ owner: newHouse['owner'] }).exec(function (err, record) {
      if (err) return res.serverError(err);

      if (record) {
        self._update(newHouse, res);
      } else {
        self._create(newHouse, res);
      }
    });
  },

  recent: function (req, res) {
    var query = House.find();
    var toSkip = req.param('skipCount') || 0;
    var batchSize = req.param('batchSize') || 9;
    var filters = req.param('search_filters') || [];

    filters.forEach(function (element) { query.where(element); });

    var sortOrder = req.param('sortOrder');
    if (sortOrder) {
      var __ = sortOrder.split('_');
      query.sort(`${__[0]} ${__[1]}`);
    }

    query.sort('updatedAt DESC').limit(batchSize).skip(toSkip).exec(function (err, house) {
      if (err) return res.serverError(err)

      return res.json(house);
    })
  },

  /* End API */

  /* Page */
  __g: function (req, res) {
    var id = req.param('id');

    House.findOne(id).exec(function (err, record) {
      if (err) return res.serverError(err);

      if (record) {
        res.view('house-detail', {
          house: record,
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

