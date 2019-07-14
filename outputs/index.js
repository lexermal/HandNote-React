"use strict";
/**
 * @format
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("react-native");
var App_1 = __importDefault(require("./App"));
// @ts-ignore
var app_json_1 = require("./app.json");
react_native_1.AppRegistry.registerComponent(app_json_1.name, function () { return App_1.default; });
