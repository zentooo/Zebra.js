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

        that.current = test;
        that.depth += 1;

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
            else {
                test.run(prev, timeout);
                that.results.push(test);
            }
        }

        that.current = prev;
        that.depth -= 1;
    }

    Runner.push = push;

    Zebra.Runner = Runner;
})();
