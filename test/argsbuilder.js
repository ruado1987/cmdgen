var argsbuilder = require( "../src/argsbuilder.js" )
    , path = require( "path" );

exports.testExecuteOnlineCommand = function( test ) {
	test.expect( 2 );

	var data = "dply_app_push Action a/b/c.class " +
                path.join( process.cwd()
                            , "dev"
                            , "Web App"
                            , "classes"
                            , "org"
                            , "test"
                            , "Test.class 0" );

    checkCommandWasExecuted( data, test );
};

exports.testExecuteBatchCommand = function( test ) {
    test.expect( 2 );
    var data = "dply_batch_push vrl-j2ee-client.jar a/b/c.class " +
                path.join( process.cwd()
                            , "dev"
                            , "Batch App"
                            , "bin"
                            , "org"
                            , "test"
                            , "Test.class" );

    checkCommandWasExecuted( data, test );
};

function checkCommandWasExecuted(data, test) {
    var cmds = argsbuilder.build(data),
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
}

exports.testExecuteMultipleCommands = function( test ) {
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
