import { write } from "write";
var genMethod = function (method) {
    return "";
};
var genRoot = function (name, methods) { return "\nexport interface " + name + " {\n  " + methods.map(function (meth) { return genMethod; }) + "\n}\n"; };
/**
 * Generates a TypeScript API definition from .api file configurations
 */
export function generateAPI(props) {
    var apiFiles = props.apiFiles;
    write.sync("test.ts", genRoot("foo", []));
}
//# sourceMappingURL=index.js.map