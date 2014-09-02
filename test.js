var Writer = require('./writer');
var Tuple2 = require('fantasy-tuples').Tuple2;

exports.testConstructor = function(test) {
    test.equal(
        5,
        new Writer(5, []).run()._1
    );
    test.done();
};

exports.testOf = function(test) {
    test.strictEqual(
        3,
        Writer.of(3).run()._1
    );

    test.strictEqual(
        0,
        Writer.of(5).run()._2.concat([]).length
    );
    test.done();
};

exports.testChain = function(test) {
    test.equal(
        8,
        Writer.of(5).chain(function(s) {
            return Writer.of(s + 3);
        }).run()._1
    );
    test.done();
};
