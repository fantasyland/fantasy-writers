var Tuple2 = require('fantasy-tuples').Tuple2;

var id = function (x) { return x; };

var overrideMethod = function ( obj, method, func ) {
  obj[method] = func;
  return obj;
}

var Writer = function(x, y) {
  this.run = function() {
    return Tuple2(x, y || { concat: id });
  };
  return this;
};

Writer.of = function(x) {
    return new Writer(x, { concat: id } );
};

Writer.prototype.chain = function(f) {
  var self = this;
  return overrideMethod(new Writer(), 'run', function() {
    var result = self.run();
    var t = f(result._1).run();
    return Tuple2(t._1, result._2.concat(t._2));
  });
};

Writer.prototype.tell = function(y) {
  var self = this;
  return overrideMethod(new Writer(), 'run', function () {
    var result = self.run();
    return new Tuple2(null, result._2.concat(y));
  });
}

Writer.prototype.map = function(f) {
  return this.chain(function(a) {
    return new Writer(f(a), { concat: id });
  });
};

Writer.prototype.ap = function(b) {
  return this.chain(function(a) {
    return b.map(a);
  });
};

Writer.WriterT = function(M) {

  var WriterT = function(x, y) {
    this.run = function() {
      return Tuple2(x, y || { concat: id });
    };
  };

  WriterT.of = function(x) {
    return new WriterT(M.of(x), { concat: id });
  };

  WriterT.lift = function(m) {
    return new WriterT(m, { concat: id } );
  };

  WriterT.prototype.chain = function(f) {
    var self = this;
    return overrideMethod(new WriterT(), 'run', function() {
      var result = self.run();
      var m = result._1.chain(f);
      return Tuple2(m, result._2);
    });
  };

  WriterT.prototype.map = function(f) {
    return this.chain(function(a) {
      return WriterT.of(a._1.map(f), { concat: id });
    });
  };

  WriterT.prototype.ap = function(b) {
    return this.chain(function(f) {
      return b.map(f);
    });
  };

  return WriterT;
}

if(typeof module != 'undefined')
  module.exports = Writer;
