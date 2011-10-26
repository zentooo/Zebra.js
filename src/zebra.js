(function() {

    var Zebra = {};

    if ( this.Zebra ) {
        configure(this.Zebra);
    }

    function configure(config) {
        Zebra.Config = config;
    }

    this.Zebra = Zebra;
})();
