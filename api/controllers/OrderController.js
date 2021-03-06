/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Util = require('../helpers/util.js');

var self = module.exports = {

  bookHouse: function (req, res) {

    if (!req.session.me) {
      return res.ok({ message: 'need to login first' });
    }

    var hostId = req.param('houseOwner');
    var startDate = Util.stringToDate(req.param('checkin'));
    var endDate = Util.stringToDate(req.param('checkout'));
    Order.find({
      serverHost: hostId,
    }).exec(function (err, orders) {
      if (err) return res.serverError(err);
      sails.log(`find ${orders.length} orders`);
      var allBookedDates = Util.ensureArray(orders).reduce(function (sum, val) { return sum.concat(Util.datesInRange(val.serviceStartDate, val.serviceEndDate)); }, []);
      sails.log(`find ${allBookedDates.length} days booked`);

      var unavailableDates = Util.datesInRange(startDate, endDate).filter(function (d) {
        return allBookedDates.reduce(function (sum, _) { return sum = sum || Util.diffDays(d, _) == 0 }, false);
      });
      sails.log(`there are ${unavailableDates.length} dates unavailable`);
      if (unavailableDates.length > 0) {
        return res.ok({ message: `dates ${unavailableDates.join(',')} are not available.` });
      }

      Order.create({
        id: Util.genID(),
        type: 'house',
        customerId: req.session.me,
        customerName: req.param('customerFullName'),
        serverHost: hostId,
        serviceStartDate: startDate,
        serviceEndDate: endDate,
        totalPrice: req.param('totalPrice'),
        paymentToken: [req.param('ccnum'), req.param('ccname'), req.param('expiredate')].join('+'),
      }).exec(function (err, aOrder) {
        if (err) return res.serverError(err);
        sails.log(`order ${aOrder.id} created`);

        return res.ok({ ok: 'ok', op: 'c' });
      });

    });

  },

  sumup: function (req, res) {
    Order.find().exec(function (err, orders) {
      if (err) return res.serverError(err);
      var houseOrders = orders.filter(function (elem) { return elem.type == "house" && typeof (elem.ratings) != "undefined" });
      sails.log(`find ${houseOrders.length} house orders`);
      var hash = {};
      houseOrders.forEach(function (elem) {
        var v = hash.hasOwnProperty(elem.serverHost) ? hash[elem.serverHost] : { ratings: [0, 0, 0, 0, 0, 0, 0], count: 0 };
        for (var i = 0; i < 7; i++) { v.ratings[i] += parseInt(elem.ratings[i]); }
        v.count++;
        hash[elem.serverHost] = v;
      });
      
      for(var key in hash) {
        for (var i = 0; i < 7; i++) { hash[key].ratings[i] = Math.round(hash[key].ratings[i] / hash[key].count) }
        House.update({houseowner: key}, {ratings: hash[key].ratings}).exec(function(err, updated){
          if (err) return res.serverError(err);
          sails.log(`${updated.length} updated`);
        });
      }
    });
    res.ok('ok');
  },
};

