var daggy = require('daggy'),
    combinators = require('fantasy-combinators'),

    Tuple2 = require('fantasy-tuples').Tuple2,
    identity = combinators.identity,

    Writer = daggy.tagged('run');

Writer.of = function(x) {
  return Writer(function() {
    return Tuple2(x, {concat: identity});
  });
};

Writer.prototype.chain = function(f) {
  var self = this;
  return Writer(function() {
    var result = self.run(),
        t = f(result._1).run();
    return Tuple2(t._1, result._2.concat(t._2));
  });
};

Writer.prototype.tell = function(y) {
  var self = this;
  return Writer(function () {
    var result = self.run();
    return Tuple2(null, result._2.concat(y));
  });
};

Writer.prototype.map = function(f) {
  var self = this;
  return Writer(function() {
    var result = self.run();
    return Tuple2(f(result._1), result._2);
  });
};

Writer.prototype.ap = function(b) {
  return this.chain(function(a) {
    return b.map(a);
  });
};

if (typeof module != 'undefined')
  module.exports = Writer;
