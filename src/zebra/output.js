(function() {

    var Output = {};

    function write(result, msg, desc) {
        var str = Zebra.Reporter.Default.format(result, msg, desc, Zebra.Runner.current, Zebra.Runner.depth);
        Zebra.Channel.Default.write(str);
    }

    Zebra.Output = Output;

})();
