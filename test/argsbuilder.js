var argsbuilder = require( "../src/argsbuilder.js" );

exports.testBuildArgumentsFromCommand = function( test ) {
	var cmds = argsbuilder.build( "dply_app_push Action a/b/c.class \
\"/home/ruavang/test/Web App\\bin\\a\\b\\c.class\" 0" );
	var cmd = cmds[0];

	test.equal( "dply_app_push", cmd.script );
	test.equal( "Action", cmd.cType );
	test.equal( "a/b/c.class", cmd.cPath );
	test.equal( "\"/home/ruavang/test/Web App\\bin\\a\\b\\c.class\"", cmd.lPath );
	test.equal( "0", cmd.restart );
	test.done();
};