/**
 * HostManagerController
 *
 * @description :: Server-side logic for managing hostmanagers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Util = require('../helpers/util');

var self = module.exports = {
    _greeting: function (aUser) {
        return typeof aUser.hosts !== 'undefined' && aUser.hosts.length > 0 ?
            `加盟伙伴 ${aUser.hosts[0].hostId}` :
            `您好 顾客 ${aUser.email}`;
    },
    /** Page */
    logout: function (req, res) {
        req.session.me = null;
        res.redirect("/");
    },

    main: function (req, res) {
        var userId = req.session.me;

        User.findOne(userId).populate('hosts').exec(function (err, aUser) {
            if (err) return res.serverError(err);

            var car, house;
            if (aUser.roles.includes("host")) {
                // load car/house
                car = house = {};
            }

            res.view("host/overview", {
                greeting: self._greeting(aUser),
                cUser: aUser,
                car: car, house: house,
                layout: 'host-layout'
            });

        });
    },

    userProfile: function (req, res) {
        var userId = req.session.me;
        User.findOne(userId).exec(function (err, aUser) {
            if (err) return res.serverError(err);

            res.view("host/userProfile", {
                cUser: aUser,
                layout: 'host-layout'
            });
        });
    },

    becomeHost: function (req, res) {
        var userId = req.session.me;

        User.findOne({ email: userId }).exec(function (err, aUser) {
            if (err) return res.serverError(err);

            res.view("host/join", {
                cUser: aUser,
                layout: 'host-layout'
            });
        });
    },

    editHouse: function (req, res) {
        var userId = req.session.me;
        User.findOne(userId).populate('hosts').exec(function (err, aUser) {
            if (err) return res.serverError(err);

            House.findOne({ owner: aUser.hosts[0].hostId }).exec(function (err, aHouse) {
                if (err) return res.serverError(err);
                sails.log(`find house ${aHouse ? aHouse.id : "[null]"}`);

                res.view("host/newOredit-house", { 
                    cUser: aUser, 
                    myHouse: aHouse,
                    layout: 'host-layout', });
            });
        });

    },

    editCar: function (req, res) {
        var userId = req.session.me;
        User.findOne(userId).populate('hosts').exec(function (err, aUser) {
            if (err) return res.serverError(err);

            Car.findOne({ owner: aUser.hosts[0].hostId }).exec(function (err, aCar) {
                if (err) return res.serverError(err);
                sails.log(`find car ${aCar ? aCar.id : "[null]"}`);

                res.view("host/newOredit-car", { 
                    cUser: aUser, 
                    myCar: aCar,
                    layout: 'host-layout', });
            });
        });
    },
    /** End Page */


};

