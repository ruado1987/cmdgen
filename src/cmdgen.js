// modules in use
var fs = require( "fs" )
    , path = require( "path" )
    , os = require( "os" )
    , argv = require( "optimist" ).argv
    , _ = require( "underscore" )
    , _s = require( "underscore.string" );

// Array.prototype methods quick reference
var concat = Array.prototype.concat,
    push = Array.prototype.push;

// mixin underscore.string to underscore namespace
_.mixin(_s.exports());
// configure interpolate regex
_.templateSettings = {
    interpolate: /\$\{(.+?)\}/g
};

// configuration vars
var isWindows = os.platform().match(/^win/)
    , config = {
        "vrl-web-app": {
            bin: path.join("Web Content", "WEB-INF", "classes")
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
    }
    , baseDir = argv.baseDir || process.cwd()
    , appTmpl = _.template("dply_app_push ${comType} ${comPath} ${localPath} 0")
    , batchTmpl = _.template("dply_batch_push ${comType} ${comPath} ${localPath}");

function getCommonDir(cType) {
    if (cType === "vrl-commons") {
        return "Framework_src";
    } else if (cType === "vrl-j2ee-client") {
        return "BatchPrograms_src";
    } else {
        return "WebApplication_src";
    }
}

function generateCommandsForInnerClasses(pathComponents, template) {
    var dir = path.dirname(path.join.apply(this, pathComponents));
    if ( fs.existsSync(dir) ) {
        var files = fs.readdirSync( dir )
            , regex = new RegExp( pathComponents[5].split(".")[0] + "\\$[^\\.]+\\.class" )
            , idx
            , cPath
            , cmds = [];
                
        files.forEach( function(file) {
            if ( regex.test(file) ) {
                pathComponents[5] = file;
                // compute the component of this inner class
                idx = file.indexOf( "$" );                
                file = _s.insert( file, idx, "'" );
                file = _s.insert( file, idx + 2, "'" );
                cPath = pathComponents[4].replace( /\\/g, "/" );
                cPath = _.join("/", cPath, file);
                
                cmds.push(template({
                    comType: pathComponents[2] + ".jar",
                    comPath: cPath,
                    localPath: _s.quote(path.join.apply(this, pathComponents))
                }));
            }
        } );
        return cmds;
    }
}

function BatchCommandGenerator() {

    this.generateCommand = function (match) {
        var pComps
            , cPath
            , cType
            , innerCmds
            , cmds = [];

        pComps = [
            baseDir,
            getCommonDir(match[1]),
            match[1],
            config[match[1]].bin,
            match[3],
            match[4].replace("java", "class")
        ];
        cPath = match[3].replace(/\\/g, "/");
        cPath = _.join("/", cPath, pComps[5]);
        cType = match[1] + ".jar";
        cmds.push( batchTmpl({
            comType: cType,
            comPath: cPath,
            localPath: _s.quote(path.join.apply(this, pComps))
        }) );
                
        if ( _.isArray((innerCmds = generateCommandsForInnerClasses(pComps, batchTmpl))) ) {
            push.apply( cmds, innerCmds );
        }
        
        return cmds;
    };
}

function OnlineCommandGenerator() {

    this.generateCommand = function (match) {
        if (match[5] === "java") {
            return generateCmdForJavaComponent(match);
        } else {
            return generateCmdForWebComponent(match);
        }
    };

    function generateCmdForJavaComponent(match) {
        var pComps
            , cPath
            , cType
            , innerCmds
            , cmds = [];

        pComps = [
           baseDir,
           getCommonDir(match[1]),
           match[1],
           config[match[1]].bin,
           match[3],
           match[4].replace("java", "class")
        ];
        cPath = match[3].replace(/\\/g, "/");
        cPath = _.join("/", cPath, pComps[5]);
        cType = match[1] === "vrl-web-app" ? "Action" : match[1] + ".jar";
        cmds.push( fillTemplate(cType, cPath, pComps) );

        if ( _.isArray((innerCmds = generateCommandsForInnerClasses(pComps, appTmpl))) ) {
            push.apply( cmds, innerCmds );
        }
        return cmds;
    }

    function generateCmdForWebComponent(match) {
        var pComps, cPath, cType;
        pComps = [
           baseDir,
           getCommonDir(),
           match[1],
           match[2],
           match[3],
           match[4]
        ];

        if (["properties", "jsp"].indexOf(match[5]) === -1) {
            cPath = match[3].replace(/\\/g, "/");
            cPath = _.join("/", cPath, match[4]);
            cType = "WAR";
        } else if ("jsp" === match[5]) {
            cPath = _s.splice(match[3], 0, 4).replace(/\\/g, "/");
            cPath = _.join("/", cPath, match[4]);
            cType = "JSP";
        } else { // properties
            cPath = match[4];
            cType = "Action";
        }

        /* remove falsy values, which may be the case when component type is JSP */
        return fillTemplate(cType, cPath, _.compact(pComps));
    }

    function fillTemplate(cType, cPath, pComps) {
        var data = {
              comType: cType,
              comPath: cPath,
              localPath: _s.quote(path.join.apply(this, pComps))
        };
        return appTmpl(data);
    }
}

function genAndWriteToFile(src, dest) {
    fs.readFile(src, "utf-8", function (err, data) {
        if (err) {
            return;
        }
        var pushCmds = genFromString(data),
            out = fs.createWriteStream(dest);

        pushCmds.forEach(function (val) {
            out.write(val + "\n");
        });
        out.end();
        out.destroy();
    });
}

function genFromString(str, batch) {
    var match, ext, cPath, generator, cmds, regex
        , exts = ["java", "tld", "jsp", "js", "xml", "properties", "css"]
        , slashes = ["/", "\\"]
        , pushCmds = [];
    
    if ( isWindows ) {
        regex = new RegExp( _.join(
                                "\\\\"
                                , "\\S+?"
                                , "([^", "]+?)"
                                , "([^", "]+?)(?:"
                                , "([^\\.]+)", "|"
                                , ")(.+)")
                            , "g" );
    } else {
        regex = new RegExp( path.join(
                                "\\S+?"
                                , "([^", "]+?)"
                                , "([^", "]+?)(?:"
                                , "([^\\.]+)"
                                , "|"
                                , ")(.+)")
                            , "g" );
    }
    
    generator = (batch === true) ? new BatchCommandGenerator() : new OnlineCommandGenerator();
    while ((match = regex.exec(str))) {
        cPath = match[0];
        if (slashes.indexOf(cPath[0]) < 0 && exts.indexOf((ext = cPath.substring(cPath.lastIndexOf(".") + 1))) >= 0) {
            cmds = generator.generateCommand(concat.call(match, ext));
            push.apply( pushCmds, _.isArray(cmds)? cmds : [cmds] );
        }
    }
    return pushCmds;
}

exports.genFromString = genFromString;
exports.genAndWriteToFile = genAndWriteToFile;
