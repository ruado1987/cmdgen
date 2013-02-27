exports.build = function (command) {
    var regex = /(dply_app_push)\s(.+?)\s(.+?)\s(.+?)\s([01]{1})/g,
        match,
        args = [],
        count = 0,
        fn;

    fn = function (match) {
			return function (spawn) {
				var args, push;

				args = Array.prototype.slice.call(match, 1);
				args.unshift("/c");				
				push = spawn("cmd", args);

				push.stdout.on("data", function (data) {
					console.log('stdout: ' + data);
				});

				push.stderr.on("data", function (data) {
					console.log('stderr: ' + data);
				});

				push.on("exit", function (code) {
					console.log('child process exited with code ' + code);
				});
			};
    };

    while ((match = regex.exec(command)) !== null) {
        args[count++] = {
            execute: fn(match)
        };
    }

    return args;
};