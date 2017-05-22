(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "FarAwayJs/communications/caller/ws", "FarAwayJs/caller", "FarAwayJs/back_create/caller/simple_stream"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ws_1 = require("FarAwayJs/communications/caller/ws");
    var caller_1 = require("FarAwayJs/caller");
    var simple_stream_1 = require("FarAwayJs/back_create/caller/simple_stream");
    function main() {
        // Activate console logs
        caller_1.farAwayCaller.debugOn();
        var wsCommunication = new ws_1.WS('localhost', '8080');
        caller_1.farAwayCaller.setCommunication(wsCommunication);
        caller_1.farAwayCaller.regBackCreateObject("SimpleStream", simple_stream_1.SimpleStream);
        caller_1.farAwayCaller.farImport(["test", "MyClass"])
            .then(function () {
            caller_1.farAwayCaller.farCall("test", ['argu1', 'argu2'])
                .then(function (result) { return console.log(result); })
                .then(nextStep);
        });
    }
    exports.main = main;
    // In the next step, we try to instantiate remotely a tiny object, and to use its method
    function nextStep() {
        caller_1.farAwayCaller.farInstantiate("MyClass", ['argConstruct1', 'argConstruct2'])
            .then(function (myClass) {
            console.log('Try to call methods of a freshly instantiated object');
            myClass.farCall("foo", ['arg1', 'arg2'])
                .then(function (result) { return console.log('Result of method call', result); })
                .then(function () { return myClass.farCall("getAPreciousStream"); })
                .then(function (stream) { console.log('Stream', stream); return stream; })
                .then(function (stream) { return listenToStream(stream); });
        });
    }
    function listenToStream(stream) {
        function listener(message) {
            console.log('Message from stream', message);
        }
        stream.addEventListener(listener);
    }
});
//# sourceMappingURL=browserCaller.js.map