var argsbuilder = require("../src/argsbuilder.js");

exports.testBuildArgumentsFromCommand = function (test) {
	var data = "dply_app_push Action a/b/c.class " +
                "\"/home/ruavang/test/Web App\\bin\\a\\b\\c.class\" 0";
		cmds = argsbuilder.build(data);

    (function (cmd) {
        cmd.execute(function (script) {
            test.equal("cmd /c " + data, script);
        });

        test.done();
    })(cmds[0]);
};
