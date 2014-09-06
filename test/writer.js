var λ = require('fantasy-check/src/adapters/nodeunit'),
    applicative = require('fantasy-check/src/laws/applicative'),
    functor = require('fantasy-check/src/laws/functor'),
    monad = require('fantasy-check/src/laws/monad'),

    helpers = require('fantasy-helpers'),
    combinators = require('fantasy-combinators'),

    Identity = require('fantasy-identities'),
    Tuple2 = require('fantasy-tuples').Tuple2,
    Writer = require('../fantasy-writers'),
    
    constant = combinators.constant,
    identity = combinators.identity;

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
        function(a) {
            return Writer.of(a).run()._1 === a;
        },
        [λ.AnyVal]
    ),
    'when testing the of for the second value': λ.check(
        function(a) {
            return Writer.of(a).run()._2.concat([]).length === 0;
        },
        [λ.AnyVal]
    ),
    'when testing the chain, returns correct value': λ.check(
        function(a, b) {
            return Writer.of(a).chain(
                function(x) {
                    return Writer.of(x + b);
                }
            ).run()._1 === a + b;
        },
        [λ.AnyVal, λ.AnyVal]
    )
};
