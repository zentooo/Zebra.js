(function() {
    var Comparator = {};

    function equal(a, b) {
        return a === b;
    }

    function classOf(a, b) {
        return typeof a === b;
    }

    function deepEqual(a, b) {
        var typeA = typeof a,
            typeB = typeof b,
            res = true,
            k;

        if ( typeA !== typeB ) {
            return false;
        }
        else if ( typeA === "object" && typeB === "object" ) {
            for ( k in a ) if ( a.hasOwnProperty(k) ) {
                res = res && deepEqual(a[k], b[k]);
            }
            return res;
        }
        else {
            return a === b;
        }
    }

    Comparator.equal = equal;
    Comparator.deepEqual = deepEqual;

    Zebra.Comparator = Comparator;
})();
