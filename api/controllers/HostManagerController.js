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

    logout: function (req, res) {
        req.session.me = null;
        res.redirect("/");
    },

    main: function (req, res) {
        var userId = req.session.me;
        User.findOne(userId).populate('hosts').exec(function (err, aUser) {
            if (err) return res.serverError(err);

            if (aUser.roles.includes("host")) {
                // load car/house
                HostInfo.findOne(aUser.hosts[0].hostId).populate('myCar').populate('myHouse').exec(function (err, aHost) {
                    if (err) return res.serverError(err);
                    sails.log(aHost);

                    res.view("overview", {
                        greeting: self._greeting(aUser),
                        cUser: aUser,
                        cCar: aHost.myCar,
                        cHouse: aHost.myHouse,
                        layout: 'host-layout'
                    });
                })
            } else {

                res.view("overview", {
                    greeting: self._greeting(aUser),
                    cUser: aUser,
                    layout: 'host-layout'
                });

            }
        });
    },

    publishTripLog: function (req, res) {


    },

    tripLog: function (req, res) {
        User.findOne(req.session.me).populate('hosts').exec(function (err, aUser) {
            if (err) return res.serverError(err);

            res.view("trip-log", {
                cUser: aUser,
                layout: 'host-layout',
            });
        });
    },

    userOrder: function (req, res) {
        User.findOne(req.session.me).populate('hosts').exec(function (err, aUser) {
            if (err) return res.serverError(err);
            Order.find({ customerId: aUser.email }).exec(function (err, myOrders) {
                if (err) return res.serverError(err);

                sails.log(`find orders for ${aUser.email}`);

                res.view("user-orders", {
                    myOrders,
                    cUser: aUser,
                    layout: 'host-layout'
                });
            });
        });
    },

    hostOrder: function (req, res) {
        User.findOne(req.session.me).populate('hosts').exec(function (err, aUser) {
            if (err) return res.serverError(err);
            sails.log(`host ${aUser.hosts[0].hostId} found`);

            Order.find({ serverHost: aUser.hosts[0].hostId }).exec(function (err, myOrders) {
                if (err) return res.serverError(err);

                sails.log(`find ${myOrders.length} orders `);

                res.view("host-orders", {
                    myOrders,
                    cUser: aUser,
                    layout: 'host-layout'
                });

            });
        });
    },

    addUserComment: function (req, res) {
        Order.findOne(req.param('orderId')).exec(function (err, aOrder) {
            if (err) return res.serverError(err);
            sails.log(`find order ${aOrder.id}`);

            aOrder.ratings = req.param('ratings');
            aOrder.commentOnHost = req.param('comment');

            aOrder.save(function (err) {
                if (err) return res.serverError(err);

                res.ok({ ok: 'ok' });
            });
        });
    },

    addHostComment: function (req, res) {
        Order.findOne(req.param('orderId')).exec(function (err, aOrder) {
            if (err) return res.serverError(err);
            sails.log(`find order ${aOrder.id}`);

            aOrder.ratingOnUser = Util.ensureArray(req.param('ratings'))[0];
            aOrder.commentOnUser = req.param('comment');

            aOrder.save(function (err) {
                if (err) return res.serverError(err);

                res.ok({ ok: 'ok' });
            });
        });
    },

    userComment: function (req, res) {
        res.view('user-comment', {
            orderId: req.param('id'),
            cUser: {},
            layout: 'host-layout',
        });
    },

    hostComment: function (req, res) {
        res.view('host-comment', {
            orderId: req.param('id'),
            cUser: {},
            layout: 'host-layout',
        });
    },

    userProfile: function (req, res) {
        var userId = req.session.me;
        User.findOne(userId).populate('hosts').exec(function (err, aUser) {
            if (err) return res.serverError(err);

            res.view("userProfile", {
                cUser: aUser,
                layout: 'host-layout'
            });

        });
    },

    updateProfile: function (req, res) {
        var userId = req.session.me;

        var newProfile = {
            cell: req.param('cell'),
            nick: req.param('nick'),
        };

        User.update(userId, newProfile).exec(function (err, aUser) {
            if (err) return res.serverError(err);

            sails.log(`user ${userId} profile updated`);

            var newHost = {
                sex: req.param('sex'),
                age: req.param('age'),
                avartar_fd: req.param('avartar_fd'),
                servicelanguage: Util.ensureArray(req.param('servicelanguage')),
                servicecity: Util.ensureArray(req.param('servicecity')),
                hobby: Util.ensureArray(req.param('hobby')),
            };

            HostInfo.update({ ofUser: userId }, newHost).exec(function (err, aHost) {
                if (err) return res.serverError(err);

                sails.log(`host ${aHost.hostId} updated`);
                return res.redirect('/dashboard');
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
                    layout: 'host-layout',
                });
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
                    layout: 'host-layout',
                });
            });
        });
    },

    contactMe: function (req, res) {
        res.view('simple-message', { from: req.session.me, to: req.param('id') });
    },

    changePassword: function(req, res) {
        var userId = req.session.me;
        User.findOne(userId).populate('hosts').exec(function (err, aUser) {
            if (err) return res.serverError(err);
            res.view("change-password", {
                greeting: self._greeting(aUser),
                cUser: aUser,
                layout: 'host-layout'
            });
           
        });
        
    },

    shortMessage: function (req, res) {
        var userId = req.session.me;

        User.findOne(userId).populate('hosts').exec(function (err, aUser) {
            if (err) return res.serverError(err);
            Message.find({ type: 'sim', to: req.session.me }).sort('updatedAt DESC').exec(function (err, messages) {
                if (err) return res.serverError(err);

                res.view('host/short-messages', {
                    cUser: aUser,
                    allShortMessages: messages,
                    layout: 'host-layout',
                });
            });
        });
    }

};

