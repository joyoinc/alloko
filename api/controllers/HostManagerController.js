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

        res.view("host/default", { chost: host, layout: 'host-layout' } );
    },

	main : function(req, res) {
        var host = req.session.me || Util.simpleID(13);
        req.session.me = host;

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


        res.view("host/default", { car: car, house: house, chost: host, layout: 'host-layout' } );
    },

    userProfile : function(req, res) {
        var userId = host = req.session.me;
        User.findOne({id: userId}).populate('profile').exec(function (err, aUser) {
            if (err) return res.serverError(err);

            if (!aUser) {
                sails.log(`Could not find User ${userId}`);

                res.notFound(`${userId}`);

            } else {
                var profiles = Util.ensureArray(aUser.profile);
                if (profiles.length < 1) {
                    sails.log(`Could not find profile of User ${userId} `);
                }
                res.view("host/userProfile", { chost: host, cUser: aUser, layout: 'host-layout' } );
            }
        });
    },

    becomeHost : function(req, res) {
        var host = req.session.me;

        res.view("user.join.ejs", { chost: host, layout: 'host-layout' } );
    },

    signIn : function(req, res) {
        var host = req.session.me;

        res.view("user.signin.ejs", { chost: host, layout: 'host-layout' } );
    },

    signUp : function(req, res) {
        var host = req.session.me;

        res.view("user.signup.ejs", { chost: host, layout: 'host-layout' } );
    },

    editHouse: function (req, res) {
        var host = req.session.me;

        House.findOne({ owner: host }).exec(function (err, myHouse) {
            if (err) return res.serverError(err);

            if (!myHouse) {
                sails.log(`Could not find house for ${host}`);

                res.view("host/newOredit-house", { chost: host, layout: 'host-layout' });
            } else {
                sails.log(`Find house ${myHouse.id} for ${host}`);

                res.view("host/newOredit-house", { chost: host, layout: 'host-layout', myHouse: myHouse });
            }
        });

    },

    editCar: function (req, res) {
        var host = req.session.me;

        Car.findOne({ owner: host }).exec(function (err, myCar) {
            if (err) return res.serverError(err);

            if (!myCar) {
                sails.log(`Could not find car for ${host}`);

                res.view("host/newOredit-car", { chost: host, layout: 'host-layout' });
            } else {
                sails.log(`Find car ${myCar.id} for ${host}`);

                res.view("host/newOredit-car", { chost: host, layout: 'host-layout', myCar: myCar });
            }
        });

    },
    /** End Page */
};

