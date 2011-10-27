(function() {

    function List() {}

    List.prototype = [];

    function forEach(callback) {
        var i = 0, iz = this.length;
        for ( ; i < iz; ++i ) {
            callback(this[i]);
        }
    }

    function all(callback) {
        var i = 0, iz = this.length, res = true;
        for ( ; i < iz; ++i ) {
            res = res && callback(this[i]);
        }
        return res;
    }

    List.prototype.forEach = forEach;
    List.prototype.all = all;

    Zebra.List = List;

})();
