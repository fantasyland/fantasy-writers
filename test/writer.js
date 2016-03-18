const λ = require('fantasy-check/src/adapters/nodeunit');
const applicative = require('fantasy-check/src/laws/applicative');
const functor = require('fantasy-check/src/laws/functor');
const monad = require('fantasy-check/src/laws/monad');

const { tagged } = require('daggy');

const { constant, identity } = require('fantasy-combinators');
const { Tuple2 } = require('fantasy-tuples');

const Identity = require('fantasy-identities');
const Writer = require('../fantasy-writers');

function run(a) {
    return Identity.of(a.run()._1);
}

const Seq = tagged('x');

Seq.empty = () => Seq([]);
Seq.prototype.empty = Seq.empty;

Seq.prototype.concat = function(x) {
    return Seq(this.x.concat(x.x));
};
Seq.prototype.length = function() {
    return this.x.length;
};

const Writerʹ = Writer(Seq);

const WriterTʹ = Writer.WriterT(Seq, Identity);

exports.writer = {

    // Applicative Functor tests
    'All (Applicative)': applicative.laws(λ)(Writerʹ, run),
    'Identity (Applicative)': applicative.identity(λ)(Writerʹ, run),
    'Composition (Applicative)': applicative.composition(λ)(Writerʹ, run),
    'Homomorphism (Applicative)': applicative.homomorphism(λ)(Writerʹ, run),
    'Interchange (Applicative)': applicative.interchange(λ)(Writerʹ, run),

    // Functor tests
    'All (Functor)': functor.laws(λ)(Writerʹ.of, run),
    'Identity (Functor)': functor.identity(λ)(Writerʹ.of, run),
    'Composition (Functor)': functor.composition(λ)(Writerʹ.of, run),

    // Monad tests
    'All (Monad)': monad.laws(λ)(Writerʹ, run),
    'Left Identity (Monad)': monad.leftIdentity(λ)(Writerʹ, run),
    'Right Identity (Monad)': monad.rightIdentity(λ)(Writerʹ, run),
    'Associativity (Monad)': monad.associativity(λ)(Writerʹ, run),

    // Manual tests
    'when testing the of': λ.check(
        (a) => Writerʹ.of(a).run()._1 === a,
        [λ.AnyVal]
    ),
    'when testing the of for the second value': λ.check(
        (a) => Writerʹ.of(a).run()._2.concat(Seq([])).length() === 0,
        [λ.AnyVal]
    ),
    'when testing the chain, returns correct value': λ.check(
        (a, b) => {
            return Writerʹ.of(a).chain((x) => Writerʹ.of(x + b)).run()._1 === a + b;
        },
        [λ.AnyVal, λ.AnyVal]
    )
};

exports.writerT = {
    // Applicative Functor tests
    'All (Applicative)': applicative.laws(λ)(WriterTʹ, run),
    'Identity (Applicative)': applicative.identity(λ)(WriterTʹ, run),
    'Composition (Applicative)': applicative.composition(λ)(WriterTʹ, run),
    'Homomorphism (Applicative)': applicative.homomorphism(λ)(WriterTʹ, run),
    'Interchange (Applicative)': applicative.interchange(λ)(WriterTʹ, run),

    // Functor tests
    'All (Functor)': functor.laws(λ)(WriterTʹ.of, run),
    'Identity (Functor)': functor.identity(λ)(WriterTʹ.of, run),
    'Composition (Functor)': functor.composition(λ)(WriterTʹ.of, run),

    // Monad tests
    'All (Monad)': monad.laws(λ)(WriterTʹ, run),
    'Left Identity (Monad)': monad.leftIdentity(λ)(WriterTʹ, run),
    'Right Identity (Monad)': monad.rightIdentity(λ)(WriterTʹ, run),
    'Associativity (Monad)': monad.associativity(λ)(WriterTʹ, run),
}
