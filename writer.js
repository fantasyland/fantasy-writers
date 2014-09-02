var Tuple2 = require('fantasy-tuples').Tuple2;

var id = function (x) { return x; };

var Writer = function(x, y) {
  this.run = function() {
    return Tuple2(x, y);
  };
  return this;
};

Writer.of = function(x) {
    return new Writer(x, { concat: id } );
};

Writer.prototype.chain = function(f) {
  var result = this.run();
  var t = f(result._1).run();
  return new Writer(t._1, result._2.concat(t._2));
};

Writer.prototype.tell = function(y) {
  var result = this.run();
  return new Writer(null, result._2.concat(y));
}

Writer.prototype.map = function(f) {
  return this.chain(function(a) {
    return new Writer(f(a), []);
  });
};

Writer.prototype.ap = function(a) {
  return this.chain(function(f) {
    return a.map(f);
  });
};

if(typeof module != 'undefined')
  module.exports = Writer;
