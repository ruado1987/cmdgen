exports.build = function (command) {
    var regex = /(dply_app_push)\s(.+?)\s(.+?)\s(.+?)\s([01]{1})/g,
        match,
        args = [],
        count = 0,
        fn;

    fn = function (match) {
        return function (exec) {
            var args,
                push = exec || require("child_process").exec;

            args = Array.prototype.slice.call(match, 1);
            args.unshift("/c");
            args.unshift("cmd");
            push(args.join(" "), function (stdin, stderr, error) {
                console.log(stdin);
                console.log();
                console.log(stderr);
                console.log();
                if (error) {
                    console.log("Error occurred: " + error);
                }
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
