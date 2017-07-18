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
        req.session.me = null;

        res.redirect("/");
    },

	main : function(req, res) {
        var userId = req.session.me;

        var car = {
            "guideintroduction": "xxd's car 2",
            "guideprice": "",
            "guidewithcarprice": "",
            "minservicetime": "1",
            "maxserivecount": "4",
            "doorcount": "4",
            "seatcount": "5",
            "cartype": "经济型",
            "cargroup": "轿车",
            "carbrand": "",
            "carmodel": "",
            "carpic_fd": "",
            "insurancepic_fd": "",
            "dlpic_fd": "",
            "modifiedBy": "xxd",
            "owner": "xxd",
            "forbids": [
                ""
            ],
            "facility": [
                ""
            ],
            "servicetypes": [
                ""
            ],
            "createdAt": "2017-07-14T01:49:11.709Z",
            "updatedAt": "2017-07-14T01:49:24.973Z",
            "id": "596823174da961c41d3a022c"
        }

        var house = {
            "housename": "xxd‘s house",
            "housetype": "公寓",
            "bedroomcount": "2",
            "livingroomcount": "2",
            "bathroomcount": "5",
            "capacity": "2",
            "country": "",
            "city": "",
            "street": "",
            "zip": "",
            "housepic_fd": "02897efb-7d40-4dca-89db-dfbd42d38c38.jpg",
            "ownershippic_fd": "",
            "forbids": [
                "pet",
                "party",
                "kid"
            ],
            "facility": [
                "kitchen",
                "freewifi"
            ],
            "checkintime": "14:00:00",
            "checkouttime": "12:00:00",
            "price": "9999",
            "minday": "1",
            "memo": "我的家 .....................",
            "modifiedBy": "xxd",
            "owner": "xxd",
            "createdAt": "2017-07-12T22:16:12.099Z",
            "updatedAt": "2017-07-14T01:50:48.062Z",
            "id": "59669fac540064f80b7d30eb"
        }

        User.findOne({email: userId}).populate('host').exec(function (err, aUser) {
            if (err) return res.serverError(err);
            if (!aUser) {
                sails.log(`Could not find User ${userId}`);
                res.notFound(`${userId}`);
            } else {
                console.log(aUser)
                res.view("host/default", { user: aUser, car: car, house: house,
                    displayId: aUser.host.length > 0 ? aUser.host[0].hostId : aUser.email, 
                    layout: 'host-layout' } );
            }
        });
    },

    userProfile : function(req, res) {
        var userId = host = req.session.me;
        User.findOne({email: userId}).populate('profile').exec(function (err, aUser) {
            if (err) return res.serverError(err);

            if (!aUser) {
                sails.log(`Could not find User ${userId}`);

                res.notFound(`${userId}`);

            } else {
                var profiles = Util.ensureArray(aUser.profile);
                if (profiles.length < 1) {
                    sails.log(`Could not find profile of User ${userId} `);
                }
                res.view("host/userProfile", { displayId: userId, cUser: aUser, layout: 'host-layout' } );
            }
        });
    },

    becomeHost : function(req, res) {
        var host = req.session.me;

        res.view("host/join", { displayId: host, layout: 'host-layout' } );
    },

    join : function(req, res) {
        var userId = host = req.session.me;

        var newHost = { hostId: Util.simpleID(11),
            firstname: req.param('firstname'),
            lastname: req.param('lastname'),
            servicetype: Util.ensureArray(req.param('servicetype')),
            servicecity: Util.ensureArray(req.param('servicecity')),
            servicelanguage: Util.ensureArray(req.param('servicelanguage')),
            hobby: Util.ensureArray(req.param('hobby')),
        };

        User.update({email: userId}, {host: newHost}).exec(function (err, aUser) {
            if (err) return res.serverError(err);

            sails.log(`user ${userId} joined as host`)
            return res.redirect('/dashboard');
        });
    },

    signIn : function(req, res) {
        var host = req.session.me;

        res.view("user.signin.ejs", { displayId: host, layout: 'host-layout' } );
    },

    signUp : function(req, res) {
        var host = req.session.me;

        res.view("user.signup.ejs", { displayId: host, layout: 'host-layout' } );
    },

    editHouse: function (req, res) {
        var host = req.session.me;

        House.findOne({ owner: host }).exec(function (err, myHouse) {
            if (err) return res.serverError(err);

            if (!myHouse) {
                sails.log(`Could not find house for ${host}`);

                res.view("host/newOredit-house", { displayId: host, layout: 'host-layout' });
            } else {
                sails.log(`Find house ${myHouse.id} for ${host}`);

                res.view("host/newOredit-house", { displayId: host, layout: 'host-layout', myHouse: myHouse });
            }
        });

    },

    editCar: function (req, res) {
        var host = req.session.me;

        Car.findOne({ owner: host }).exec(function (err, myCar) {
            if (err) return res.serverError(err);

            if (!myCar) {
                sails.log(`Could not find car for ${host}`);

                res.view("host/newOredit-car", { displayId: host, layout: 'host-layout' });
            } else {
                sails.log(`Find car ${myCar.id} for ${host}`);

                res.view("host/newOredit-car", { displayId: host, layout: 'host-layout', myCar: myCar });
            }
        });

    },
    /** End Page */
};

