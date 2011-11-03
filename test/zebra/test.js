test("initialize", function() {
    var t = new Zebra.Test("msg", false);
    is(t.msg, "msg", "init message");
    is(t.async, false, "init async");

    is(t.msg, "msg", "init message");
    is(t.desc, void 0, "init desc");

    is(t.before, void 0, "init before");
    is(t.after, void 0, "init after");

    ok(t.testList instanceof Zebra.List, "init testList");

    is(t.parent, void 0, "init arent");
});

test("Zebra.Test.prototype.push", function() {
    var t1 = new Zebra.Test("msg1", false);
    var t2 = new Zebra.Test("msg2", false);

    var future = function() {};
    var msg = "msg";

    t1.push(future, msg);
    ok(t1.testList[0] instanceof Zebra.Test);

    t1.push(t2);
    isd(t1.testList[1], t2);
});

test("Zebra.Test.prototype.start with only simple callbacks", function() {
    Zebra.Output = {};
    Zebra.Output.write = function() {};

    var that = this;
    var test_true = sinon.spy(function() { return true; });
    var test_false = function() { return false; };
    var test_throw = function() { throw "exception"; };

    (function() {
        var t = new Zebra.Test("msg", false);
        t.push(test_true, "msg11", that);
        t.push(test_true, "msg12", that);

        is ( t.testList.length, 2 );

        t.start();
        ok(t.value, "summary true because all test green");
        ok(test_true.calledOn(that));
    })();

    (function() {
        var t = new Zebra.Test("msg", false);
        t.push(test_true, "msg11");
        t.push(test_false, "msg12");
        t.push(test_true, "msg13");

        is(t.testList.length, 3);

        t.start();
        ok(! t.value, "summary false because one test red");
    })();

    (function() {
        var t = new Zebra.Test("msg", false);
        t.push(test_true, "msg11");
        t.push(test_true, "msg12");
        t.push(test_throw, "msg13");

        is(t.testList.length, 3);

        t.start();
        ok(! t.value, "summary false because one test raises error");
        is(t.error, "exception", "test error is exception thrown in child");
    })();
});

test("Zebra.Test.prototype.start with parent", function() {
    Zebra.Output = {};
    Zebra.Output.write = function() {};

    var before = sinon.spy();
    var test1 = sinon.spy(function() { return true; });
    var test2 = sinon.spy(function() { return true; });
    var after = sinon.spy();

    var t = new Zebra.Test("msg", false);
    t.push(test1, "msg11");
    t.push(test2, "msg11");

    t.start( { before: before, after: after } );

    ok(before.calledBefore(test1), "parent.before called before test");
    ok(before.calledBefore(test2), "parent.before called before test");

    ok(after.calledAfter(test1), "parent.after called after test");
    ok(after.calledAfter(test2), "parent.after called after test");

    ok(before.calledTwice);
    ok(after.calledTwice);
});

test("Zebra.Test.prototype.run (sync)", function() {
    Zebra.Output = {};
    Zebra.Output.write = function() {};

    var test = function() { return true; };

    var t = new Zebra.Test("msg", false);
    t.push(test);
    t.push(test);
    t.run();

    ok(t.value, "test result is green because all tests green");
});

test("Zebra.Test.prototype.run (async)", function() {
    Zebra.Output = {};
    Zebra.Output.write = function() {};

    var test = function() { return true; };

    var t = new Zebra.Test("msg", true);
    t.push(test);
    t.push(test);
    t.run();

    t.start();

    ok(t.value, "test result is green because all tests green");
});

test("Zebra.Test.prototype.start with promises and Test instances", function() {
    Zebra.Output = {};
    Zebra.Output.write = function() {};

    var test_true = function() { return true; };
    var test_false = function() { return false; };

    var t_green = new Zebra.Test("msg", false);
    var t_red = new Zebra.Test("msg", false);

    var t1 = new Zebra.Test("msg", false);
    var t2 = new Zebra.Test("msg", false);
    var t3 = new Zebra.Test("msg", false);

    t1.push(test_true);
    t1.push(test_true);

    t2.push(test_true);
    t2.push(test_true);

    t3.push(test_true);
    t3.push(test_false);

    t_green.push(t1);
    t_green.push(test_true);
    t_green.push(t2);

    t_red.push(t2);
    t_red.push(test_true);
    t_red.push(t3);

    t_green.start();
    t_red.start();

    ok(t_green.value, "test result is green because all tests green");
    ok(! t_red.value, "test result is red because includes red subtest");
});

asyncTest("Zebra.Test.prototype.run (async with default timeout)", function() {
    Zebra.Output = {};
    Zebra.Output.write = function() {};

    var test = function() { return true; };

    var t = new Zebra.Test("msg", true);
    t.push(test);
    t.push(test);

    t.run();

    t.errorback = function() {
        ok(! t.value, "test result is red because of timeout");
        start();
    };
});

asyncTest("Zebra.Test.prototype.run (async with user timeout)", function() {
    Zebra.Output = {};
    Zebra.Output.write = function() {};

    var test = function() { return true; };

    var t = new Zebra.Test("msg", true);
    t.push(test);
    t.push(test);

    t.run({}, 1000);
    t.errorback = function() {
        ok(! t.value, "test result is red because of timeout");
        start();
    };
});

asyncTest("Zebra.Test.prototype.run (async with mixed tests)", function() {
    Zebra.Output = {};
    Zebra.Output.write = function() {};

    var test = function() { console.log("run"); return true; };

    var t1 = new Zebra.Test("msg1", true);
    var t2 = new Zebra.Test("msg2", true);
    var t3 = new Zebra.Test("msg3", true);
    var t4 = new Zebra.Test("msg4", true);
    var t5 = new Zebra.Test("msg5", true);

    t1.push(sinon.spy(test));
    t2.push(sinon.spy(test));
    t3.push(sinon.spy(test));
    t4.push(sinon.spy(test));
    t5.push(sinon.spy(test));

    t3.push(t4);
    t3.push(t5);
    t2.push(t3);
    t1.push(t2);

    t1.run(void 0, void 0, function() {
        ok(t1.value, "test result is green because all test is green");
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

    var test = function() { return true; };

    var t1 = new Zebra.Test("msg", true);
    var t2 = new Zebra.Test("msg", true);

    t1.push(test);
    t2.push(test);

    t1.push(t2);
    t1.run(void 0, 1000);
    t1.start();

    setTimeout(function() {
        t2.start();
        ok(! t1.value, "test result is red because of internal timeout");
        console.dir(t1);
        start();
    }, Zebra.Test.defaultTimeout + 500);
});
