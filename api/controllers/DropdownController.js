/**
 * DropdownController
 *
 * @description :: Server-side logic for managing dropdowns
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    load: function (req, res) {
        var id = req.param('id');
        var parentValue = req.param('parV') || '';

        if (id == 0) {
            return res.json([{ v: 'us', t: 'USA' }, { v: 'cn', t: 'CHINA' }, { v: 'jp', t: 'JAPAN' }]);
        }

        if (id == 1) {
            var all = [{ v: 'rdu', t: 'Raleigh', p: 'us' }, { v: 'nyc', t: 'New York', p: 'us' }, { v: 'pek', t: 'Bei jing', p: 'cn' }, { v: 'pvg', t: 'Shang hai', p: 'cn' }, { v: 'tyo', t: 'Tokyo', p: 'jp' }];
            var result = all.filter(function(_){ return _.p == parentValue}).map(function(_){ return {v:_.v, t:_.t} });
            return res.json(result);
        }
    }
};

