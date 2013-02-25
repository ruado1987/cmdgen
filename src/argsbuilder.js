exports.build = function( command ) {
	var regex = /(dply_app_push)\s(.+?)\s(.+?)\s(.+?)\s([01]{1})/g,
	match, args = [], count = 0;

	while( (match = regex.exec(command)) != null ) {
		args[count++] = {
			script: match[1],
			cType: match[2],
			cPath: match[3],
			lPath: match[4],
			restart: match[5]
		};
	}
	
	return args;
};