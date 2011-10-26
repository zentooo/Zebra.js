(function() {

    function Test(msg, async) {
        this.msg = msg;
        this.async = async;

        this.desc = void 0;
        this.result = true;

        this.before = void 0;
        this.after = void 0;

        this.testList = new Zebra.List();
        this.resultList = new Zebra.List();
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
        this.testList.forEach(function(test) {
            var result, desc;

            if ( typeof parent.before === "function" ) {
                parent.before();
            }

            if ( test instanceof Test ) {
                result = test.run();
                desc = test.desc;
            }
            else {
                try {
                    result = test.promise();
                }
                catch(e) {
                    result = false;
                    desc = e;
                }
            }

            if ( typeof parent.after === "function" ) {
                parent.after();
            }

            Zebra.Output.write(result, test.msg, desc);

            this.resultList.push({
                result: result,
                msg: test.msg,
                desc: desc
            });
        });

        return this.resultList.all(function(item) {
            return item.result;
        });
    }

    function run(parent, timeout) {
        if ( this.async ) {
            setTimeout(function() {
                this.result = false;
                this.desc = "Async test timed out";
            }, timeout || Test.defaultTimeout);
        }
        else {
            this.result = this.start(parent);
        }
    }

    Test.defaultTimeout = 5000;
    Zebra.Test = Test;

})();
