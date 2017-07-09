/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /* API */
	me : function(req, res) {
        req.session.me = req.param('uid');

        res.ok(req.session.me);
    },

    /* End API */
};

