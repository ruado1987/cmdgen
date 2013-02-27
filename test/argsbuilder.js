var argsbuilder = require("../src/argsbuilder.js");

exports.testBuildArgumentsFromCommand = function (test) {
    var cmds = argsbuilder.build("dply_app_push Action a/b/c.class " +
        "\"/home/ruavang/test/Web App\\bin\\a\\b\\c.class\" 0");

    (function (cmd) {
        cmd.execute(function (script, args) {
            test.equal("dply_app_push", args[1]);
            test.equal("Action", args[2]);
            test.equal("a/b/c.class", args[3]);
            test.equal("\"/home/ruavang/test/Web App\\bin\\a\\b\\c.class\"", args[4]);
            test.equal("0", args[5]);

            return {
                stdout: {
                    on: function () {}
                },
                stderr: {
                    on: function () {}
                },
                on: function () {}
            };
        });

        test.done();
    })(cmds[0]);
};