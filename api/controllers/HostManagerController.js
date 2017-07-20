/**
 * HostManagerController
 *
 * @description :: Server-side logic for managing hostmanagers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Util = require('../helpers/util');

var self = module.exports = {
    _displayId: function (aUser) {
        return aUser.hostInfo.length > 0 ?
            `加盟伙伴 ${aUser.hostInfo[0].hostId}` :
            `顾客 ${aUser.email}`;
    },
    /** Page */
    logout: function (req, res) {
        req.session.me = null;
        res.redirect("/");
    },

    main: function (req, res) {
        var userId = req.session.me;
        var car = {}, house = {};

        User.findOne({ email: userId }).populate('profile').populate('hostInfo').exec(function (err, aUser) {
            if (err) return res.serverError(err);
            if (!aUser) {
                sails.log(`Could not find User ${userId}`);
                res.notFound(`user ${userId}`);
            }

            res.view("host/default", {
                displayId: self._displayId(aUser),
                user: aUser, car: car, house: house,
                notHost: aUser.hostInfo.length == 0,
                layout: 'host-layout'
            });

        });
    },

    userProfile: function (req, res) {
        var userId = req.session.me;
        User.findOne({ email: userId }).populate('profile').populate('hostInfo').exec(function (err, aUser) {
            if (err) return res.serverError(err);

            if (!aUser) {
                sails.log(`Could not find User ${userId}`);
                res.notFound(`user ${userId}`);
            } else {
                res.view("host/userProfile", {
                    displayId: self._displayId(aUser),
                    cUser: aUser,
                    layout: 'host-layout'
                });
            }
        });
    },

    becomeHost: function (req, res) {
        var userId = req.session.me;
        res.view("host/join", { displayId: userId, layout: 'host-layout' });
    },

    editHouse: function (req, res) {
        var userId = req.session.me;

        House.findOne({ owner: userId }).populate('owner').exec(function (err, myHouse) {
            if (err) return res.serverError(err);

            if (!myHouse) {
                sails.log(`Could not find house for ${userId}`);

                res.view("host/newOredit-house", { layout: 'host-layout' });
            } else {
                sails.log(`Find house ${myHouse.id} for ${userId}`);

                res.view("host/newOredit-house", {  myHouse: myHouse, layout: 'host-layout', });
            }
        });

    },

    editCar: function (req, res) {
        var host = req.session.me;

        Car.findOne({ owner: host }).exec(function (err, myCar) {
            if (err) return res.serverError(err);

            if (!myCar) {
                sails.log(`Could not find car for ${host}`);

                res.view("host/newOredit-car", { layout: 'host-layout' });
            } else {
                sails.log(`Find car ${myCar.id} for ${host}`);

                res.view("host/newOredit-car", { layout: 'host-layout', myCar: myCar });
            }
        });

    },
    /** End Page */


};

