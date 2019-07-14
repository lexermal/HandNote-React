"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_svg_1 = __importStar(require("react-native-svg"));
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var SvgExample = /** @class */ (function (_super) {
    __extends(SvgExample, _super);
    function SvgExample(props, context) {
        var _this = _super.call(this, props, context) || this;
        console.log('Hello World');
        return _this;
    }
    SvgExample.prototype.render = function () {
        return react_1.default.createElement(react_native_1.View, { style: [
                react_native_1.StyleSheet.absoluteFill,
                { alignItems: 'center', justifyContent: 'center' },
            ] },
            react_1.default.createElement(react_native_svg_1.default, { height: "50%", width: "50%", viewBox: "0 0 100 100" },
                react_1.default.createElement(react_native_svg_1.Circle, { cx: "50", cy: "50", r: "45", stroke: "blue", strokeWidth: "2.5", fill: "green" }),
                react_1.default.createElement(react_native_svg_1.Rect, { x: "15", y: "15", width: "70", height: "70", stroke: "red", strokeWidth: "2", fill: "yellow" })));
    };
    return SvgExample;
}(react_1.default.Component));
exports.default = SvgExample;
