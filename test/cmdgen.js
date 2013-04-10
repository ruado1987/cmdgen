var cmdgen = require( "../index.js" ),
    _ = require( "underscore" ),
    path = require( "path" );

var tmpl = _.template("dply_app_push ${comType} " +
            "${comPath} \"" + process.cwd() + path.sep +
            "${localPath}\" 0"),

    batchTmpl = _.template("dply_batch_push ${comType} " +
            "${comPath} \""	+ process.cwd()	+ path.sep +
            "${localPath}\"");

_.mixin({
    classify: function (str) {
        return str.replace(/\.java/g, ".class");
    }
});

function extractComponentPath(p, s) {
    return p.substring(p.indexOf(s) + s.length + 1).replace(/\\/g, "/");
}

function testCommandGeneratedAsExpected(component, tmplData, batch) {
    var cmd,
        flags = testCommandGeneratedAsExpected.BATCH_FLAGS;
    if (typeof batch === "undefined") {
        batch = 4;
    }
    
    if (flags & batch === 1) {
        cmd = cmdgen.genFromString(component, true);
        this.equal(cmd[0], batchTmpl(tmplData));
    } else if (flags & batch === 4) {
        cmd = cmdgen.genFromString(component);
        this.equal(cmd[0], tmpl(tmplData));
    } else {
        throw new Error();
    }
    this.done();
}
testCommandGeneratedAsExpected.BATCH_FLAGS = 1 | 4;

exports.testGenCmdFromJSPComponent = function (test) {
    var component = path.join(
                        "WebApplication_src"
                        , "vrl-web-app"
                        , "Web Content"
                        , "JSP"
                        , "org"
                        , "test"
                        , "Test.jsp");

    testCommandGeneratedAsExpected.call(test, component, {
        comType: "JSP",
        localPath: component,
        comPath: extractComponentPath(component, "JSP")
    });
};

exports.testGenCmdFromPropertiesComponent = function (test) {
    var component = path.join(
                        "WebApplication_src"
                        , "vrl-web-app"
                        , "Java Source"
                        , "Test-XX.properties");

    testCommandGeneratedAsExpected.call(test, component, {
        comType: "Action",
        localPath: component,
        comPath: extractComponentPath(component, "Java Source")
    });
};

exports.testGenCmdFromEjbJavaComponent = function (test) {
    var component = path.join(
                        "WebApplication_src"
                        , "vrl-ejb-app"
                        , "ejbModule"
                        , "org"
                        , "test"
                        , "TestCommand.java");

    testCommandGeneratedAsExpected.call(test, component, {
        comType: "vrl-ejb-app.jar",
        localPath: _.classify(component.replace("ejbModule", "bin")),
        comPath: _.classify(extractComponentPath(component, "ejbModule"))
    });
};

exports.testGenCmdFromDAOJavaComponent = function (test) {
    var component = path.join(
                    "WebApplication_src"
                    , "vrl-dao-app"
                    , "source"
                    , "org"
                    , "test"
                    , "TestVO.java");

    testCommandGeneratedAsExpected.call(test, component, {
        comType: "vrl-dao-app.jar",
        localPath: _.classify(component.replace("source", "bin")),
        comPath: _.classify(extractComponentPath(component, "source"))
    });
};

exports.testGenCmdFromCommonJavaComponent = function (test) {
    var component = path.join(
                    "Framework_src"
                    , "vrl-commons"
                    , "source"
                    , "org"
                    , "test"
                    , "Test.java");

    testCommandGeneratedAsExpected.call(test, component, {
        comType: "vrl-commons.jar",
        localPath: _.classify(component.replace("source", "bin")),
        comPath: _.classify(extractComponentPath(component, "source"))
    });
};

exports.testGenCmdFromXmlComponent = function (test) {
    var component = path.join(
                    "WebApplication_src"
                    , "vrl-web-app"
                    , "Web Content"
                    , "WEB-INF"
                    , "Test-Cmd.xml");

    testCommandGeneratedAsExpected.call(test, component, {
        comType: "WAR",
        localPath: component,
        comPath: extractComponentPath(component, "Web Content")
    });
};

exports.testGenCmdFromJsComponent = function (test) {
    var component = path.join(
                    "WebApplication_src"
                    , "vrl-web-app"
                    , "Web Content"
                    , "scripts"
                    , "test"
                    , "test.file-0.1.js");

    testCommandGeneratedAsExpected.call(test, component, {
        comType: "WAR",
        localPath: component,
        comPath: extractComponentPath(component, "Web Content")
    });
};

exports.testGenCmdFromCssComponent = function (test) {
    var component = path.join(
                    "WebApplication_src"
                    , "vrl-web-app"
                    , "Web Content"
                    , "theme"
                    , "vrl.css");

    testCommandGeneratedAsExpected.call(test, component, {
        comType: "WAR",
        localPath: component,
        comPath: extractComponentPath(component, "Web Content")
    });
};

exports.testGenCmdFromTldComponent = function (test) {
    var component = path.join(
                    "WebApplication_src"
                    , "vrl-web-app"
                    , "Web Content"
                    , "WEB-INF"
                    , "test-file-utils.tld");

    testCommandGeneratedAsExpected.call(test, component, {
        comType: "WAR",
        localPath: component,
        comPath: extractComponentPath(component, "Web Content")
    });
};

exports.testForceGeneratingBatchJavaComponent = function (test) {
    var component = path.join(
                        "Framework_src"
                        , "vrl-commons"
                        , "source"
                        , "org"
                        , "test"
                        , "Test.java");

    testCommandGeneratedAsExpected.call(test, component, {
        comType: "vrl-commons.jar",
        localPath: _.classify(component.replace("source", "bin")),
        comPath: _.classify(extractComponentPath(component, "source"))
    }, 1);
};

exports.testGenCmdFromBatchJavaComponentContainingNestedClasses = function (test) {
    var component = path.join(
                        "WebApplication_src"
                        , "vrl-ejb-app"
                        , "ejbModule"
                        , "inner"
                        , "A.java");

    var cmd = cmdgen.genFromString(component, true);
    testInnerCommandGeneratedAsExpected.apply( test, [cmd, component, batchTmpl] );
};

exports.testGenCmdFromJavaComponentContainingNestedClasses = function (test) {
    var component = path.join(
                        "WebApplication_src"
                        , "vrl-ejb-app"
                        , "ejbModule"
                        , "inner"
                        , "A.java");

    var cmd = cmdgen.genFromString(component);
    testInnerCommandGeneratedAsExpected.apply( test, [cmd, component, tmpl] );
};

function testInnerCommandGeneratedAsExpected(cmd, component, template) {
    this.equal(cmd[0], template({
        comType: "vrl-ejb-app.jar",
        localPath: _.classify(component.replace("ejbModule", "bin")),
        comPath: _.classify(extractComponentPath(component, "ejbModule"))
    }));
    this.equal(cmd[1], template({
        comType: "vrl-ejb-app.jar",
        localPath: path.join(path.dirname(_.classify(component.replace("ejbModule", "bin"))), "/A$1.class"),
        comPath: path.dirname(_.classify(extractComponentPath(component, "ejbModule"))) + "/A'$'1.class"
    }));
    
    this.done();
}

function testEmptyCommandGenerated( component ) {
    var cmd = cmdgen.genFromString( component );
    this.equal( cmd, "" );
}

exports.testGenCmdWithUnmatchingComponentPaths = function (test) {
    testEmptyCommandGenerated.call( test, path.join("WebApplication_src", "lta-vrl", "lib", "commons-lang.jar") );
    testEmptyCommandGenerated.call( test, path.join("WebApplication_src", "vrl-web-app", "Web Content", "META-INF", "MANIFEST.MF") );
    testEmptyCommandGenerated.call( test, path.join("/WebApplication_src", "vrl-web-app", "Web Content", "WEB-INF", "lta-vrl-en2-utils.tld") );
    testEmptyCommandGenerated.call( test, path.join("\\WebApplication_src", "vrl-web-app", "Web Content", "WEB-INF", "lta-vrl-en2-utils.tld") );

    test.done();
};
