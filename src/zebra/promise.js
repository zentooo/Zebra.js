(function() {

    function Promise(callback, errorback, cancelback) {
        this.value = void 0;
        this.error = void 0;
        this.canceled = false;
        this.done = false;
        this.callback = callback;
        this.errorback = errorback;
        this.cancelback = cancelback;
    }

    function complete(value) {
        if ( this.error ) {
            throw this.error;
        }
        else if ( this.value ) {
            throw "promise already complete";
        }
        else if ( this.canceled ) {
            return;
        }
        else if ( ! this.done ) {
            this.value = value;

            if ( this.callback ) {
                this.callback(value);
            }

            this.done = true;
        }
    }

    function fail(error) {
        if ( ! this.done ) {
            this.error = error;

            if ( this.errorback ) {
                this.errorback(error);
            }

            this.done = true;
        }
    }

    function cancel() {
        if ( this.cancelback ) {
            this.cancelback();
        }

        if ( this.done ) {
            return false;
        }
        else {
            this.canceled = true;
            this.done = true;
            return true;
        }
    }

    function join(promises, joinDone) {
        var that = this, i = 0, iz = promises.length, done = 0;

        for ( ; i < iz; ++i ) {
            (function(org, i){
                promises[i].callback = function(value) {

                    done++;

                    org(value);
                    joinDone(promises[i]);

                    console.log("done of " + promises[i].id);
                    console.log("done = " + done);
                    console.log("all = " + iz);

                    if ( done === iz ) {
                        that.complete(promises.all(function(item) {
                            return item.value;
                        }));
                        console.log("complete of " + that.id);
                    }
                };
            })(promises[i].callback || function() {}, i);
        }
    }

    function then(callback) {
        var promise = new Promise(),
            orgCallback = this.callback,
            orgErrorback = this.errorback,
            orgCancelback = this.cancelback;

        this.callback = function(value) {
            orgCallback(value);
            promise.complete(callback());
        };
        this.errorback = function(e) {
            orgErrorback(e);
            promise.fail(e);
        };
        this.cancelback = function(e) {
            orgCancelback();
            promise.fail("forward promise canceled");
        };

        return promise;
    }

    function waitFor(promises, n) {
        var that = this, i = 0, iz = promises.length, done = 0;

        for ( ; i < iz; ++i ) {
            (function(org, i){
                promises[i].callback = function(value) {
                    org(value);
                    done++;

                    if ( done === n ) {
                        promises.filter(function(promise) {
                            return ! promise.done;
                        }).forEach(function(promise) {
                            promise.cancel();
                        });
                    }
                };
            })(promises[i].callback, i);
        }
    }

    (function(pp) {
        pp.complete = complete;
        pp.fail = fail;
        pp.cancel = cancel;
        pp.join = join;
        pp.then = then;
        pp.waitFor = waitFor;
    })(Promise.prototype);

    Zebra.Promise = Promise;

})();
