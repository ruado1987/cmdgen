var argsbuilder = require("../src/argsbuilder.js");

exports.testBuildArgumentsFromCommand = function( test ) {
	test.expect( 2 );
	
	var data = "dply_app_push Action a/b/c.class " +
                "\"/home/ruavang/test/Web App\\bin\\a\\b\\c.class\" 0";
		cmds = argsbuilder.build(data),
		controller = {
			done: function() {
				test.ok(true);	
			}	
		};

    (function (cmd) {
        cmd.execute(function (script, callback) {
            test.equal("cmd /c " + data, script);
            callback();
        }, controller);

        test.done();
    })(cmds[0]);
};

exports.testExecuteBatchOfCommand = function( test ) {
	test.expect( 4 );
	
	var cmd = {
			execute: function( script, controller ) {
				test.ok( true );
				controller.done();	
			}
		},
		commands = [ cmd, cmd, cmd, cmd ],
		controller = new argsbuilder.Controller( commands );
		
	controller.executeBatch();
	test.done();
};