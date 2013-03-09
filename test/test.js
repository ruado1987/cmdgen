var cmdgen = require('../index.js'),
    _ = require('underscore');

var tmpl = _.template("dply_app_push ${comType} " +
    "${comPath} \"" + process.cwd() +
    "/src\\${localPath}\" 0");

_.mixin({
    classify: function (str) {
        return str.replace(/\.java/g, ".class");
    }
});

function extractComponentPath(p, s) {
    return p.substring(p.indexOf(s) + s.length + 1).replace(/\\/g, "/");
}

function testCommandGeneratedAsExpected(component, tmplData) {
    var cmd = cmdgen.genFromString(component);

    this.equal(cmd[0], tmpl(tmplData));
    this.done();
}

exports.testGenCmdFromJSPComponent = function (test) {
    var component = "WebApplication_src\\vrl-web-app\\Web " +
        "Content\\JSP\\en2\\declareOPCUsage\\OPCUsageDeclarationEntry.jsp";

    testCommandGeneratedAsExpected.call(test, component, {
        comType: "JSP",
        localPath: component,
        comPath: extractComponentPath(component, "JSP")
    });
};

exports.testGenCmdFromPropertiesComponent = function (test) {
    var component = "WebApplication_src\\vrl-web-app\\Java " +
        "Source\\ApplicationResources-EN2.properties";

    testCommandGeneratedAsExpected.call(test, component, {
        comType: "Action",
        localPath: component,
        comPath: extractComponentPath(component, "Java Source")
    });
};

exports.testGenCmdFromEjbJavaComponent = function (test) {
    var component = "WebApplication_src\\vrl-ejb-app\\ejbModule\\sg" +
        "\\gov\\lta\\vrl\\app\\command\\en2\\CommonCodeCommand.java";

    testCommandGeneratedAsExpected.call(test, component, {
        comType: "vrl-ejb-app.jar",
        localPath: _.classify(component.replace("ejbModule", "bin")),
        comPath: _.classify(extractComponentPath(component, "ejbModule"))
    });
};

exports.testGenCmdFromDAOJavaComponent = function (test) {
    var component = "WebApplication_src\\vrl-dao-app\\source\\sg" +
        "\\gov\\lta\\vrl\\app\\vo\\en2\\AppellantIDType.java";

    testCommandGeneratedAsExpected.call(test, component, {
        comType: "vrl-dao-app.jar",
        localPath: _.classify(component.replace("source", "bin")),
        comPath: _.classify(extractComponentPath(component, "source"))
    });
};

exports.testGenCmdFromCommonJavaComponent = function (test) {
    var component = "Framework_src\\vrl-commons\\source\\sg" +
        "\\gov\\lta\\vrl\\commons\\EN2FunctionID.java";

    testCommandGeneratedAsExpected.call(test, component, {
        comType: "vrl-commons.jar",
        localPath: _.classify(component.replace("source", "bin")),
        comPath: _.classify(extractComponentPath(component, "source"))
    });
};

exports.testGenCmdFromBatchJavaComponent = function (test) {
    var component = "BatchPrograms_src\\vrl-j2ee-client\\appClientModule\\" + 
                    "sg\\gov\\lta\\vrl\\app\\batch\\enf2\\field\\TextFile.java";

    testCommandGeneratedAsExpected.call(test, component, {
        comType: "vrl-j2ee-client.jar",
        localPath: _.classify(component.replace("appClientModule", "bin")),
        comPath: _.classify(extractComponentPath(component, "appClientModule"))
    });
};

exports.testGenCmdFromXmlComponent = function (test) {
    var component = "WebApplication_src\\vrl-web-app\\Web " +
        "Content\\WEB-INF\\EN2-Cmd.xml";

    testCommandGeneratedAsExpected.call(test, component, {
        comType: "WAR",
        localPath: component,
        comPath: extractComponentPath(component, "Web Content")
    });
};

exports.testGenFromJsComponent = function (test) {
    var component = "WebApplication_src\\vrl-web-app\\Web " +
        "Content\\scripts\\plupload\\jquery.postalCode-0.1.js";

    testCommandGeneratedAsExpected.call(test, component, {
        comType: "WAR",
        localPath: component,
        comPath: extractComponentPath(component, "Web Content")
    });
};

exports.testGenFromCssComponent = function (test) {
    var component = "WebApplication_src\\vrl-web-app\\Web " +
        "Content\\theme\\vrl.css";

    testCommandGeneratedAsExpected.call(test, component, {
        comType: "WAR",
        localPath: component,
        comPath: extractComponentPath(component, "Web Content")
    });
};

exports.testGenFromTldComponent = function (test) {
    var component = "WebApplication_src\\vrl-web-app\\Web " +
        "Content\\WEB-INF\\lta-vrl-en2-utils.tld";

    testCommandGeneratedAsExpected.call(test, component, {
        comType: "WAR",
        localPath: component,
        comPath: extractComponentPath(component, "Web Content")
    });
};
