exports.build =	function( command ) {
	var	fn, match,
		regex =	/(dply_app_push)\s(.+?)\s(.+?)\s(.+?)\s([01]{1})/g,		
		commands = [],
		count =	0;

	fn = function( match ) {
		return function( exec, controller ) {
			var	args,				
				push = exec	|| require( "child_process" ).exec;

			args = Array.prototype.slice.call( match, 1 );
			args.unshift("/c");
			args.unshift("cmd");
			push(args.join(" "), function ( stdin, stderr, error ) {
				console.log( stdin + "\n" );
				console.log( stderr+ "\n" );			
				if ( error && error.code ) {
					console.log( "Error occurred:\n" + error.code );
				}
				controller.done();
			});			
		};
	};

	while ((match = regex.exec( command ))) {
		commands[ count++ ] =	{
			execute: fn( match )
		};
	}

	return commands;
};
exports.Controller = function( commands ) {
	return {
		idx: 0,
		cmds: commands,
		done: function() {
			var cmds = this.cmds,
				idx = this.idx;
			if ( idx < cmds.length - 1 ) {
				cmds[ this.idx++ ].execute( null, this );
			}			
		},
		executeBatch: function() {
			this.cmds[ 0 ].execute( null, this );	
		}
	};
};
