(function() {

    var Runner = {
        current: {},
        depth: 0,
        results: []
    };

    function push(msg, callback, async, timeout) {
        var t = new Zebra.Test(msg, async),
            prev = Zebra.current,
            result = true;

        Zebra.Runner.current = t;
        Zebra.Runner.depth += 1;

        callback(t);

        if ( prev instanceof Zebra.Test ) {
            prev.push(t);
        }
        else {
            t.run(prev, timeout);
            this.results.push(t);
        }

        Zebra.Runner.current = prev;
        Zebra.Runner.depth -= 1;
    }

    Runner.push = push;

    Zebra.Runner = Runner;
})();
