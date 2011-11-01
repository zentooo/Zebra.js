//test("push single synchronous test", function() {
    //Zebra.Output = {};
    //Zebra.Output.write = function() {};

    //var spy = sinon.spy();

    //is(Zebra.Runner.depth, 0, "current depth is 0");

    //Zebra.Runner.push("msg1", function(t) {
        //is(Zebra.Runner.current, t, "current tests pased as argument");
        //is(Zebra.Runner.depth, 1, "current depth is 1");

        //t.push(spy, "msg11");
        //t.push(spy, "msg12");
    //}, false, 1000);

    //ok(spy.calledTwice, "inner tests also runs");
    //ok(Zebra.Runner.results.length, 1, "test results piled on Runner");

    //is(Zebra.Runner.depth, 0, "current depth is 0");
//});

test("synchronous nested test", function() {
    Zebra.Output = {};
    Zebra.Output.write = function() {};

    var spy = sinon.spy();

    is(Zebra.Runner.depth, 0, "current depth is 0");

    Zebra.Runner.push("msg1", function(t) {
        is(Zebra.Runner.current, t, "current tests pased as argument");
        is(Zebra.Runner.depth, 1, "current depth is 1");
        t.push(spy, "msg11");

        Zebra.Runner.push("msg2", function(t) {
            is(Zebra.Runner.current, t, "current tests pased as argument");
            is(Zebra.Runner.depth, 2, "current depth is 2");
            t.push(spy, "msg21");

            Zebra.Runner.push("msg2", function(t) {
                is(Zebra.Runner.current, t, "current tests pased as argument");
                is(Zebra.Runner.depth, 3, "current depth is 3");
                t.push(spy, "msg31");
            });

        });

    }, false, 1000);

    ok(spy.calledThrice, "inner tests also runs");
    ok(Zebra.Runner.results.length, 3, "test results piled on Runner");

    is(Zebra.Runner.depth, 0, "current depth is 0");
});

test("asynchronous nested test", function() {
    Zebra.Output = {};
    Zebra.Output.write = function() {};

    var spy = sinon.spy();

    is(Zebra.Runner.depth, 0, "current depth is 0");

    Zebra.Runner.push("msg1", function(t) {
        is(Zebra.Runner.current, t, "current tests pased as argument");
        is(Zebra.Runner.depth, 1, "current depth is 1");
        t.push(spy, "msg11");
        t.start();

        Zebra.Runner.push("msg2", function(t) {
            is(Zebra.Runner.current, t, "current tests pased as argument");
            is(Zebra.Runner.depth, 2, "current depth is 2");
            t.push(spy, "msg21");
            t.start();

            Zebra.Runner.push("msg3", function(t) {
                is(Zebra.Runner.current, t, "current tests pased as argument");
                is(Zebra.Runner.depth, 3, "current depth is 3");
                t.push(spy, "msg31");
                t.start();
            }, true, 1000);

        }, true, 1000);

    }, true, 1000);

    ok(spy.calledThrice, "inner tests also runs");
    ok(Zebra.Runner.results.length, 3, "test results piled on Runner");

    is(Zebra.Runner.depth, 0, "current depth is 0");
});
