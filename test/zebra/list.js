test("forEach", function() {
    var list = new Zebra.List();
    var spy = sinon.spy();

    list.push(1);
    list.push(1);
    list.push(1);

    list.forEach(spy);
    ok(spy.calledThrice, "spy called thrice by forEach");
});

test("all", function() {
    var list_ok = new Zebra.List();
    var list_ng = new Zebra.List();
    var spy = sinon.spy();

    list_ok.push(true);
    list_ok.push(true);
    list_ok.push(true);

    list_ok.push(true);
    list_ng.push(false);
    list_ok.push(true);

    ok (list_ok.all(function(i) { return i; } ), "all true => true");
    ok (! list_ng.all(function(i) { return i; } ), "not all true => false");
});
