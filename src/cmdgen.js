// modules in use
var fs = require("fs"),
    argv = require("optimist").argv,
    _ = require("underscore"),
    _s = require("underscore.string");

// mixin underscore.string to underscore namespace
_.mixin(_s.exports());
// configure interpolate regex
_.templateSettings = {
    interpolate: /\$\{(.+?)\}/g
};

// configuration vars
var config = {
        "vrl-web-app": {
            bin: "Web Content\\WEB-INF\\classes"
        },
        "vrl-ejb-app": {
            bin: "bin"
        },
        "vrl-dao-app": {
            bin: "bin"
        },
        "vrl-commons": {
            bin: "bin"
        },
        "vrl-j2ee-client": {
            bin: "bin"
        }
    },
    baseDir = argv.baseDir || __dirname,
    cmdTmpl = _.template("dply_app_push ${comType} ${comPath} ${localPath} 0");

function generateCommand(match) {
    if ("java" === match[5]) {
        return generateCmdForJavaComponent(match);
    } else {
        return generateCmdForWebComponent(match);
    }
}

function generateCmdForJavaComponent(match) {
    var pComps, cPath, cType;
    pComps = [
		baseDir,
		getCommonDir( match[1] ),
		match[1],
		config[match[1]].bin,
		match[3],
		match[4] + ".class"];
    cPath = match[3].replace(/\\/g, "/");
    cPath = _.join("/", cPath, match[4] + ".class");
    cType = match[1] === "vrl-web-app" ? "Action" : match[1] + ".jar";

    return fillTemplate(cType, cPath, pComps);
}

function generateCmdForWebComponent(match) {
    var pComps, cPath, cType;
    pComps = [
		baseDir,
		getCommonDir(),
		match[1],
		match[2],
		match[3],
		_.join(".", match[4], match[5])];

    if (["properties", "jsp"].indexOf(match[5]) === -1) {
        cPath = match[3].replace(/\\/g, "/");
        cPath = _.join("/", cPath, _.join(".", match[4], match[5]));
        cType = "WAR";
    } else if ("jsp" === match[5]) {
        cPath = _s.splice(match[3], 0, 4).replace(/\\/g, "/");
        cPath = _.join("/", cPath, _.join(".", match[4], match[5]));
        cType = "JSP";
    } else { // properties
        cPath = _.join(".", match[4], match[5]);
        cType = "Action";
    }

    /* remove falsy values, which may be the case when component type is JSP */
    return fillTemplate(cType, cPath, _.compact(pComps));
}

function getCommonDir( cType ) {
    if (cType === "vrl-commons") {
        return "Framework_src";
    } else if (cType === "vrl-j2ee-client") {
        return "BatchPrograms_src";
    } else {
        return "WebApplication_src";
    }
}

function fillTemplate(cType, cPath, pComps) {
    return cmdTmpl({
        comType: cType,
        comPath: cPath,
        localPath: _s.quote(pComps.join("\\"))
    });
}

function genAndWriteToFile(src, dest) {
    fs.readFile(src, "utf-8", function (err, data) {
        var pushCmds = genFromString(data);

        var out = fs.createWriteStream(dest, {
            flags: 'w+',
            encoding: 'utf-8',
            mode: 0666
        });

        pushCmds.forEach(function (val, idx) {
            out.write(val);
            out.write("\n");
        });
        out.end();
        out.destroy();
    });
}

function genFromString(str) {
    var regex = /[^\-]+(vrl\-[^\\]+)\\(.+?)(?:\\(.+)\\|\\)(.+)\.(java|tld|jsp|js|xml|properties|css)/g,
        match,
        pushCmds = [];

    while ((match = regex.exec(str)) !== null) {
        pushCmds.push(generateCommand(match));
    }

    return pushCmds;
}

exports.genFromString = genFromString;
exports.genAndWriteToFile = genAndWriteToFile;
