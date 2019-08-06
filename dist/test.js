"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function hoge(value) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(value);
        }, 1000);
    });
}
function piyo(value) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(value);
        }, 1000);
    });
}
function hogehoge() {
    return __awaiter(this, void 0, void 0, function* () {
        return `${yield piyo("foo")}  ${yield piyo("bar")}  ${yield piyo("baz")}`;
    });
}
function fuga() {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield piyo(10)) * (yield piyo(20)) + (yield piyo(5));
    });
}
fuga().then(console.log);
hogehoge().then(console.log);
