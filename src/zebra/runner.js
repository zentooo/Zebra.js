(function() {

    var Runner = {
        current: {},
        depth: 0,
        results: []
    };

    function push(msg, testBlock, async, timeout) {
        var test = new Zebra.Test(msg, async),
            prev = Zebra.current,
            result = true,
            that = this;

        Zebra.Runner.current = test;
        Zebra.Runner.depth += 1;

        testBlock(test);

        if ( prev instanceof Zebra.Test ) {
            prev.push(t);
        }
        else {
            if ( test.async ) {
                test.run(prev, timeout, function(t) {
                    that.results.push(t);
                });
            }
            that.results.push(test);
        }

        Zebra.Runner.current = prev;
        Zebra.Runner.depth -= 1;
    }

    Runner.push = push;

    Zebra.Runner = Runner;
})();
