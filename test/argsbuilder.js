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

exports.testExecuteCommandAndRestartServer = function( test ) {
    test.expect( 4 );
  
    var data = "dply_app_push Action a/b/c.class " +
                path.join( process.cwd()
                            , "dev"
                            , "Web App"
                            , "classes"
                            , "org"
                            , "test"
                            , "Test.class 0" );
    
    checkCommandWasExecuted( data, test, true );
};

function checkCommandWasExecuted(data, test) {
    var args = arguments[2] ? [data, arguments[2]] : [data],
        cmds = argsbuilder.build.apply( null, args ),
        controller = {
          done: function() {
            test.ok(true);
          }
        };
     
    for ( var idx = 0; idx < args.length; idx++ ) {
      executeTest(cmds[idx], args[idx]);  
    }
    
    test.done();
    
    function executeTest(cmd, arg) {
      cmd.execute(function (script, callback) {
          test.equal("cmd /c " + (arg === true ? "Exec_was_cmd restartWAS.sh" : arg), script);
  
          callback();
      }, controller);      
    }
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
