test("initialize", function() {
    var t = new Zebra.Test("msg", false);
    is(t.msg, "msg", "init message");
    is(t.async, false, "init async");

    is(t.msg, "msg", "init message");
    is(t.desc, void 0, "init desc");

    is(t.before, void 0, "init before");
    is(t.after, void 0, "init after");

    ok(t.testList instanceof Zebra.List, "init testList");
    ok(t.resultList instanceof Zebra.List, "init resultList");

    is(t.parent, void 0, "init arent");
});

test("Zebra.Test.prototype.push", function() {
    var t1 = new Zebra.Test("msg1", false);
    var t2 = new Zebra.Test("msg2", false);

    var future = function() {};
    var msg = "msg";

    t1.push(future, msg);
    isd(t1.testList[0], { future: future, msg: msg });

    t1.push(t2);
    isd(t1.testList[1], t2);
});

test("Zebra.Test.prototype.start with only promises", function() {
    Zebra.Output = {};
    Zebra.Output.write = function() {};

    var promise_true = function() { return true; };
    var promise_false = function() { return false; };
    var promise_throw = function() { throw "exception"; };

    (function() {
        var t = new Zebra.Test("msg", false);
        t.push(promise_true, "msg11");
        t.push(promise_true, "msg12");

        is ( t.testList.length, 2 );

        var summary = t.start();
        ok(summary, "summary true because all promise green");
        is(t.resultList.length, 2);
    })();

    (function() {
        var t = new Zebra.Test("msg", false);
        t.push(promise_true, "msg11");
        t.push(promise_false, "msg12");
        t.push(promise_true, "msg13");

        is ( t.testList.length, 3 );

        var summary = t.start();
        ok(! summary, "summary tfalse because one promise red");
        is(t.resultList.length, 3);
    })();

    (function() {
        var t = new Zebra.Test("msg", false);
        t.push(promise_true, "msg11");
        t.push(promise_true, "msg12");
        t.push(promise_throw, "msg13");

        is(t.testList.length, 3);

        var summary = t.start();
        ok(! summary, "summary false because one promise red");
        is(t.resultList.length, 3);

        is(t.resultList[2].desc, "exception", "test desc is equal to exception if thrown");
    })();
});

test("Zebra.Test.prototype.start with parent", function() {
    Zebra.Output = {};
    Zebra.Output.write = function() {};

    var before = sinon.spy();
    var promise = sinon.spy();
    var after = sinon.spy();

    var t = new Zebra.Test("msg", false);
    t.push(promise, "msg11");
    t.push(promise, "msg11");

    t.start( { before: before, after: after } );

    ok(before.calledBefore(promise), "parent.before called before promise");
    ok(after.calledAfter(promise), "parent.after called after promise");

    ok(before.calledTwice);
    ok(after.calledTwice);
});

test("Zebra.Test.prototype.run (sync)", function() {
    Zebra.Output = {};
    Zebra.Output.write = function() {};

    var promise = function() { return true; };

    var t = new Zebra.Test("msg", false);
    t.push(promise);
    t.push(promise);
    t.run();

    ok(t.result, "test result is green because all tests green");
});

test("Zebra.Test.prototype.run (async)", function() {
    Zebra.Output = {};
    Zebra.Output.write = function() {};

    var promise = function() { return true; };

    var t = new Zebra.Test("msg", true);
    t.push(promise);
    t.push(promise);
    t.run();

    t.start();

    ok(t.result, "test result is green because all tests green");
});

test("Zebra.Test.prototype.start with promises and Test instances", function() {
    Zebra.Output = {};
    Zebra.Output.write = function() {};

    var promise_true = function() { return true; };
    var promise_false = function() { return false; };

    var t_green = new Zebra.Test("msg", false);
    var t_red = new Zebra.Test("msg", false);

    var t1 = new Zebra.Test("msg", false);
    var t2 = new Zebra.Test("msg", false);
    var t3 = new Zebra.Test("msg", false);

    t1.push(promise_true);
    t1.push(promise_true);

    t2.push(promise_true);
    t2.push(promise_true);

    t3.push(promise_true);
    t3.push(promise_false);

    t_green.push(t1);
    t_green.push(promise_true);
    t_green.push(t2);

    t_red.push(t2);
    t_red.push(promise_true);
    t_red.push(t3);

    ok(t_green.start(), "test result is green because all tests green");
    ok(! t_red.start(), "test result is red because includes red subtest");
});

asyncTest("Zebra.Test.prototype.run (async with default timeout)", function() {
    Zebra.Output = {};
    Zebra.Output.write = function() {};

    var promise = function() { return true; };

    var t = new Zebra.Test("msg", true);
    t.push(promise);
    t.push(promise);
    t.run(void 0, void 0, function() {
        ok(! t.result, "test result is red because of timeout");
        start();
    });
});

asyncTest("Zebra.Test.prototype.run (async with user timeout)", function() {
    Zebra.Output = {};
    Zebra.Output.write = function() {};

    var promise = function() { return true; };

    var t = new Zebra.Test("msg", true);
    t.push(promise);
    t.push(promise);
    t.run(void 0, 1000, function() {
        ok(! t.result, "test result is red because of timeout");
        start();
    });
});

asyncTest("Zebra.Test.prototype.run (async with mixed tests)", function() {
    Zebra.Output = {};
    Zebra.Output.write = function() {};

    var promise = function() { return true; };

    var t1 = new Zebra.Test("msg1", true);
    var t2 = new Zebra.Test("msg2", true);
    var t3 = new Zebra.Test("msg3", true);
    var t4 = new Zebra.Test("msg4", true);
    var t5 = new Zebra.Test("msg5", true);

    t1.push(promise);
    t2.push(promise);
    t3.push(promise);
    t4.push(promise);
    t5.push(promise);

    t3.push(t4);
    t3.push(t5);
    t2.push(t3);
    t1.push(t2);

    t1.run(void 0, void 0, function() {
        ok(t1.result, "test result is green because all test is green");
        start();
    });
    t1.start();
    t2.start();
    t3.start();
    t4.start();
    t5.start();
});

asyncTest("Zebra.Test.prototype.run (async with mixed tests, with timeout)", function() {
    Zebra.Output = {};
    Zebra.Output.write = function() {};

    var promise = function() { return true; };

    var t1 = new Zebra.Test("msg", true);
    var t2 = new Zebra.Test("msg", true);

    t1.push(promise);
    t2.push(promise);

    t1.push(t2);
    t1.run(void 0, 1000);
    t1.start();
    setTimeout(function() {
        t2.start();
        ok(! t1.result, "test result is red because of internal timeout");
        start();
    }, Zebra.Test.defaultTimeout + 500);
});
