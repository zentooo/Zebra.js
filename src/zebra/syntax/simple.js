(function() {

    var cmp = Zebra.Comparator;

    // matchers

    function push(promise, msg) {
        Zebra.Runner.current.push(promise, msg);
    }

    function ok(a, msg) {
        push(function() { return a === true; }, msg);
    }

    function ng(a, msg) {
        push(function() { return a !== true; } , msg);
    }

    function is(a, b, msg) {
        push(function() { return cmp.equal(a, b); }, msg);
    }

    function isnt(a, b, msg) {
        push(function() { return ! cmp.equal(a, b); }, msg);
    }

    function is_deeply(a, b, msg) {
        push(function() { return cmp.deepEqual(a, b); }, msg);
    }

    function isnt_deeply(a, b, msg) {
        push(function() { return ! cmp.deepEqual(a, b); }, msg);
    }


    // structs

    function test(msg, callback) {
        Zebra.Runner.push(msg, callback, false);
    }

    function asyncTest(msg, callback, timeout) {
        Zebra.Runner.push(msg, callback, true, timeout);
    }

    function setup(callback) {
        Zebra.Runner.current.before = callback;
    }

    function teardown(callback) {
        Zebra.Runner.current.after = callback;
    }

    Zebra.Syntax.Simple = Simple;

})();
