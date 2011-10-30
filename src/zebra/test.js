(function() {

    var testId = 0;

    function Test(msg, async) {
        this.msg = msg;
        this.async = async;
        this.callback = function() {};
        this.timeout = false;
        this.nomatch = false;

        this.desc = void 0;
        this.result = false;

        this.before = void 0;
        this.after = void 0;

        this.testList = new Zebra.List();
        this.resultList = new Zebra.List();

        this.parent = void 0;

        this.id = ++testId;
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
                    console.log("wait on " + that.id + " " + wait);

                    test.run(that, void 0,  function(t) {
                        that.resultList.push({
                            result: t.result,
                            msg: test.msg,
                            desc: t.desc
                        });

                        runned++;
                        console.log("runned on " + that.id + " " + runned);

                        if ( wait === runned && ! test.timeout && ! test.nomatch ) {
                            that.update();
                            that.callback(that);
                            clearTimeout(that.timeoutId);

                            console.log("final callback called of " + that.id);
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

            // asyncronous after?
            if ( typeof parent.after === "function" ) {
                parent.after();
            }


            Zebra.Output.write(result, test.msg, desc);
        });


        if ( that.async && wait === 0 ) {
            that.update();
            that.callback(that);
            clearTimeout(that.timeoutId);
        }

        that.update();
        return that.result;
    }

    function update() {
        this.result = this.resultList.all(function(item) {
            return item.result;
        });
        if ( this.parent ) {
            console.log("call parent update of " + this.id);
            this.parent.update();
        }
    }

    function run(parent, timeout, callback) {
        var that = this;
        that.parent = parent;

        if ( that.async ) {

            that.callback = callback || function() {};

            that.timeoutId = setTimeout(function() {
                that.timeout = true;
                that.result = false;
                that.desc = "Async test timed out";
                console.log("timeout of " + that.id);
                that.callback(that);
                that.update();
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
        tp.update = update;
    })(Test.prototype);

    Test.defaultTimeout = 5000;
    Zebra.Test = Test;

})();
