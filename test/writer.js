const λ = require('fantasy-check/src/adapters/nodeunit');
const applicative = require('fantasy-check/src/laws/applicative');
const functor = require('fantasy-check/src/laws/functor');
const monad = require('fantasy-check/src/laws/monad');

const {constant, identity} = require('fantasy-combinators');
const {Tuple2} = require('fantasy-tuples');

const Identity = require('fantasy-identities');
const Writer = require('../fantasy-writers');

function run(a) {
    return Identity.of(a.run()._1);
}

exports.writer = {

    // Applicative Functor tests
    'All (Applicative)': applicative.laws(λ)(Writer, run),
    'Identity (Applicative)': applicative.identity(λ)(Writer, run),
    'Composition (Applicative)': applicative.composition(λ)(Writer, run),
    'Homomorphism (Applicative)': applicative.homomorphism(λ)(Writer, run),
    'Interchange (Applicative)': applicative.interchange(λ)(Writer, run),

    // Functor tests
    'All (Functor)': functor.laws(λ)(Writer.of, run),
    'Identity (Functor)': functor.identity(λ)(Writer.of, run),
    'Composition (Functor)': functor.composition(λ)(Writer.of, run),

    // Monad tests
    'All (Monad)': monad.laws(λ)(Writer, run),
    'Left Identity (Monad)': monad.leftIdentity(λ)(Writer, run),
    'Right Identity (Monad)': monad.rightIdentity(λ)(Writer, run),
    'Associativity (Monad)': monad.associativity(λ)(Writer, run),

    // Manual tests
    'when testing the of': λ.check(
        (a) => Writer.of(a).run()._1 === a,
        [λ.AnyVal]
    ),
    'when testing the of for the second value': λ.check(
        (a) => Writer.of(a).run()._2.concat([]).length === 0,
        [λ.AnyVal]
    ),
    'when testing the chain, returns correct value': λ.check(
        (a, b) => {
            return Writer.of(a).chain((x) => Writer.of(x + b)).run()._1 === a + b;
        },
        [λ.AnyVal, λ.AnyVal]
    )
};
