test("test for equal", function() {
    var c = Zebra.Comparator;
    var obj1 = {};
    var obj2 = {};
    var func1 = function() {};
    var func2 = function() {};

    ok(c.equal(1, 1), "compare simple value");
    ok(c.equal(obj1, obj1), "compare object: same reference");
    ok(c.equal(func1, func1), "compare function: same reference");

    ok(! c.equal(1, '1'), "compare simple value with defferent type");
    ok(! c.equal(obj1, obj2), "compare object: dirrerent reference");
    ok(! c.equal(func1, func2), "compare function: dirrerent reference");
});

test("test for deepEqual (simple values)", function() {
    var c = Zebra.Comparator;
    var obj1 = {};
    var obj2 = {};
    var func1 = function() {};
    var func2 = function() {};

    ok(c.deepEqual(1, 1), "compare simple value");
    ok(c.deepEqual(obj1, obj1), "compare object: same reference");
    ok(c.deepEqual(func1, func1), "compare function: same reference");

    ok(c.deepEqual(obj1, obj2), "compare object: dirrerent reference but same content");
    ok(! c.deepEqual(func1, func2), "compare function: dirrerent reference");
});

test("test for deepEqual (complex object)", function() {
    var c = Zebra.Comparator;
    var obj1 = { k1: 1, k2: "1" };

    var obj2 = { k1: 1, k2: 1 };
    var obj3 = { k1: 1, k2: 1 };

    var obj4 = {
        k1: {
            k11: 1,
            k2: {
                k21: "str",
                k3: {
                    k31: obj2
                }
            }
        }
    };

    var obj5 = {
        k1: {
            k11: 1,
            k2: {
                k21: "str",
                k3: {
                    k31: obj2
                }
            }
        }
    };

    ok(! c.deepEqual(obj1, obj2), "compare object: dirrerent type value");

    ok(c.deepEqual(obj2, obj3), "obj2 and obj3 are equal because their contents are the same");
    ok(c.deepEqual(obj4, obj5), "obj4 and obj5 are equal because their contents are the same");
});
