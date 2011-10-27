var testrunner = require("qunit");

testrunner.run([
    {
        deps: ["src/zebra.js", "test/helper.js"],
        code: "src/zebra/list.js",
        tests: "test/zebra/list.js"
    }
]);
