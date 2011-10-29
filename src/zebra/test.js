(function() {

    function Test(msg, async) {
        this.msg = msg;
        this.async = async;
        this.callback = function() {};
        this.timeout = false;

        this.desc = void 0;
        this.result = false;

        this.before = void 0;
        this.after = void 0;

        this.testList = new Zebra.List();
        this.resultList = new Zebra.List();

        this.parent = void 0;
    }

    function push(promise, msg) {
        if ( promise instanceof Test ) {
            this.testList.push(promise);
        }
        else {
            this.testList.push({
                promise: promise,
                msg: msg
            });
        }
    }

    function start(parent) {
        var that = this, wait = 0, runned = 0;
        parent = parent || that.parent || {};

        that.testList.forEach(function(test) {
            var result, desc;

            if ( typeof parent.before === "function" ) {
                parent.before();
            }

            if ( test instanceof Test ) {
                if ( test.async ) {
                    wait++;
                    console.log("wait "+ wait);
                    test.run(that, void 0, function(r, d) {
                        that.resultList.push({
                            result: r,
                            msg: test.msg,
                            desc: d
                        });

                        runned++;
                        console.log("runned "+ runned);

                        if ( wait === runned && ! test.timeout ) {
                            that.result = that.resultList.all(function(item) {
                                return item.result;
                            });
                            that.callback(that.result, that.desc);
                            console.log("final callback called");
                        }
                    });
                }
                else {
                    that.resultList.push({
                        result: test.run(that),
                        msg: test.msg,
                        desc: test.desc
                    });
                }
            }
            else {
                try {
                    result = test.promise();
                }
                catch(e) {
                    result = false;
                    desc = e;
                }
                that.resultList.push({
                    result: result,
                    msg: test.msg,
                    desc: desc
                });
            }

            if ( typeof parent.after === "function" ) {
                parent.after();
            }

            Zebra.Output.write(result, test.msg, desc);
        });


        that.result = that.resultList.all(function(item) {
            return item.result;
        });

        if ( that.async && wait === 0 ) {
            that.callback(that.result, that.desc);
        }

        if ( that.resultList.length !== that.testList.length ) {
            that.desc = "test number and result number not matched";
            that.result = false;
        }

        return that.result;
    }

    function run(parent, timeout, callback) {
        var that = this;
        that.parent = parent;

        if ( that.async ) {

            that.callback = callback || function() {};

            setTimeout(function() {
                that.timeout = true;
                that.result = false;
                that.desc = "Async test timed out";
            }, timeout || Test.defaultTimeout);
        }
        else {
            that.result = that.start(parent);
        }

        return that.result;
    }

    (function(tp) {
        tp.push = push;
        tp.start = start;
        tp.run = run;
    })(Test.prototype);

    Test.defaultTimeout = 5000;
    Zebra.Test = Test;

})();
