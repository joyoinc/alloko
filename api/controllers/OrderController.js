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
      not: {
        or: [
          { serviceStartDate: { '>': endDate } },
          { serviceEndDate: { '<': startDate } },
        ]
      },
    }).exec(function (err, orders) {
      if (err) return res.serverError(err);
      sails.log(`find ${orders.length} orders`);

      var unavailableDates = [];
      Util.ensureArray(orders).forEach(function (order) {
        Util.datesInRange(startDate, endDate).forEach(function (d) {
          if (Util.isInRange(d, order.serviceStartDate, order.serviceEndDate))
            unavailableDates.push(d);
        });
      });
      sails.log(`there are ${unavailableDates.length} dates`);
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
};

