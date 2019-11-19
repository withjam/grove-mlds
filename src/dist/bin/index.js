import { generateAPI } from "./generator";
var MLDSGenerator = /** @class */ (function () {
    function MLDSGenerator() {
    }
    MLDSGenerator.main = function () {
        console.log("generate");
        generateAPI({ outputPath: "abc" });
        return 0;
    };
    return MLDSGenerator;
}());
//# sourceMappingURL=index.js.map