/**
 * HostManagerController
 *
 * @description :: Server-side logic for managing hostmanagers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Util = require('../helpers/util');

module.exports = {
    /** Page */
    me : function(req, res) {
        host = req.session.me;

        res.view("dashboard", { chost: host, layout: 'host.layout.ejs' } );
    },

	main : function(req, res) {
        var host = Util.simpleID(3);
        req.session.me = host;

        res.view("dashboard", { chost: host, layout: 'host.layout.ejs' } );
    },

    editHouse: function (req, res) {
        var host = req.session.me;

        House.findOne({ owner: host }).exec(function (err, myHouse) {
            if (err) return res.serverError(err);

            if (!myHouse) {
                sails.log(`Could not find house for ${host}`);

                res.view("house.edit.ejs", { chost: host, layout: 'host.layout.ejs' });
            } else {
                sails.log(`Find house ${myHouse.id} for ${host}`);

                res.view("house.edit.ejs", { chost: host, layout: 'host.layout.ejs', myHouse: myHouse });
            }
        });

    },

    editCar: function (req, res) {
        var host = req.session.me;

        Car.findOne({ owner: host }).exec(function (err, myCar) {
            if (err) return res.serverError(err);

            if (!myCar) {
                sails.log(`Could not find car for ${host}`);

                res.view("car.edit.ejs", { chost: host, layout: 'host.layout.ejs' });
            } else {
                sails.log(`Find car ${myCar.id} for ${host}`);

                res.view("car.edit.ejs", { chost: host, layout: 'host.layout.ejs', myCar: myCar });
            }
        });

    },
    /** End Page */
};

