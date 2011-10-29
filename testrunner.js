var testrunner = require("qunit");

testrunner.options.errorStack = true;

testrunner.run([
    {
        deps: ["src/zebra.js", "test/helper.js"],
        code: "src/zebra/list.js",
        tests: "test/zebra/list.js"
    },
    {
        deps: ["src/zebra.js", "test/helper.js"],
        code: "src/zebra/comparator.js",
        tests: "test/zebra/comparator.js"
    }
]);
