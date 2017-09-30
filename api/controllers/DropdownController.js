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
            return res.json([{ v: 'us', t: '美国' }, { v: 'cn', t: '中国' }, { v: 'jp', t: '日本' }]);
        }

        if (id == 1) {
            var all = [{ v: 'rdu', t: '罗利', p: 'us' }, 
            { v: 'nyc', t: '纽约', p: 'us' }, 
            { v: 'bos', t: '波士顿', p: 'us' }, 
            { v: 'san', t: '旧金山', p: 'us' }, 
            { v: 'las', t: '拉斯维加斯', p: 'us' }, 
            { v: 'pek', t: '北京', p: 'cn' }, 
            { v: 'pvg', t: '上海', p: 'cn' }, 
            { v: 'tyo', t: '东京', p: 'jp' }];
            var result = all.filter(function(_){ return _.p == parentValue}).map(function(_){ return {v:_.v, t:_.t} });
            return res.json(result);
        }
    }
};

