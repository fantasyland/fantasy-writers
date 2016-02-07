'use strict';

const daggy = require('daggy');

const { of, chain, map, ap } = require('fantasy-land');
const { identity } = require('fantasy-combinators');
const { Tuple2 } = require('fantasy-tuples');

const Writer = M => {

    const Writer = daggy.tagged('run');

    Writer.of = function(x) {
        return Writer(() => Tuple2(x, M.empty()));
    };

    Writer.prototype.chain = function(f) {
        return Writer(() => {
            const result = this.run();
            const t = f(result._1).run();
            return Tuple2(t._1, result._2.concat(t._2));
        });
    };

    Writer.prototype.tell = function(y) {
        return Writer(() => {
            const result = this.run();
            return Tuple2(null, result._2.concat(y));
        });
    };

    Writer.prototype.map = function(f) {
        return Writer(() => {
            const result = this.run();
            return Tuple2(f(result._1), result._2);
        });
    };

    Writer.prototype.ap = function(b) {
        return this.chain((a) => b.map(a));
    };

    return Writer;

};

module.exports = Writer;