(function() {
    var Comparotor = {};

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
        else if ( a === b ) {
            return true;
        }
        else if ( typeA === "object" && typeB === "object" ) {
            for ( k in a ) if ( a.hasOwnProperty(k) ) {
                res = deepEqual(a[k], b[k]);
            }
            return res;
        }
        else {
            return false;
        }
    }

    Comparotor.equal = equal;
    Comparotor.deepEqual = deepEqual;

    Zebra.Comparotor = Comparotor;
})();
