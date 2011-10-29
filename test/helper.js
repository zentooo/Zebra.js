(function() {

    if ( QUnit ) {
        is = strictEqual;
        isd = deepEqual;
    }

    // for node.js
    if ( typeof global === "object" ) {
        global.sinon = require("sinon");
    }
})();
