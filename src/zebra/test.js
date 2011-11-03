(function() {

    var testId = 0;

    function Test(msg, async) {
        this.msg = msg;
        this.async = async;
        this.callback = function() {};

        this.desc = void 0;

        this.before = void 0;
        this.after = void 0;

        this.testList = new Zebra.List();

        this.parent = void 0;

        this.id = ++testId;
    }

    function push(t, msg, context) {
        var test;
        if ( t instanceof Test ) {
            this.testList.push(t);
        }
        else {
            test = new Test(msg, false);
            test.run = function() {
                if ( t.call(context) ) {
                    test.complete(true);
                }
                else {
                    test.fail("failed");
                }
            };
            this.testList.push(test);
        }
    }

    function start(parent) {
        var that = this;
        parent = parent || that.parent || {};

        that.join(that.testList, function(t) {
            Zebra.Output.write(test.value, test.msg, test.desc);

            if ( typeof parent.after === "function" ) {
                parent.after();
            }
        });

        that.testList.forEach(function(test) {
            if ( typeof parent.before === "function" ) {
                parent.before();
            }
            try {
                test.run(that);
            } catch(e) {
                that.fail(e);
            }
        });
    }

    function update() {
        this.value = this.testList.all(function(item) {
            return item.value;
        });
        if ( this.parent && typeof this.parent.update === "function" ) {
            console.log("call parent update of " + this.id);
            this.parent.update();
        }
    }

    function run(parent, timeout, callback) {
        var that = this, org = that.callback;
        that.parent = parent;

        if ( that.async ) {
            that.callback = function() {
                clearTimeout(that.timeoutId);
                org();
                console.log("all joined on " + that.id);
                if ( typeof callback === "function" ) {
                    callback();
                }
            };

            that.timeoutId = setTimeout(function() {
                console.log("timeout of " + that.id);
                that.fail("Async test timed out");
                that.update();
            }, timeout || Test.defaultTimeout);
        }
        else {
            that.start(parent);
        }
    }

    Test.prototype = new Zebra.Promise();

    (function(tp) {
        tp.push = push;
        tp.start = start;
        tp.run = run;
        tp.update = update;
    })(Test.prototype);

    Test.defaultTimeout = 5000;
    Zebra.Test = Test;

})();
