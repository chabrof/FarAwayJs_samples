(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "FarAwayJs/js/callee", "FarAwayJs/js/communications/callee/wss", "FarAwayJs/js/back_create/callee/simple_stream"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var callee_1 = require("FarAwayJs/js/callee");
    var wss_1 = require("FarAwayJs/js/communications/callee/wss");
    var simple_stream_1 = require("FarAwayJs/js/back_create/callee/simple_stream");
    // We define a very simple function
    function test(arg1, arg2) {
        return "Success (args : " + arg1 + " , " + arg2;
    }
    //
    // Here we define an instantiable object
    //
    function MyClass(arg1, arg2) {
        this._prop1 = arg1;
        this._prop2 = arg2;
    }
    var wsCommunication = new wss_1.WSS('localhost', '8080');
    // Create of a simpleStreamer, and send data every 2 sec period
    var streamer = new simple_stream_1.SimpleStream("localhost", "8080");
    streamer.setCommunication(wsCommunication); // the communication instance can be used and shared with the FarAway instance
    setInterval(function () { return streamer.sendData({ Test: "test" }); }, 2000);
    var streamer2 = new simple_stream_1.SimpleStream("localhost", "8080");
    streamer2.setCommunication(wsCommunication); // the communication instance can be used and shared with the FarAway instance
    setInterval(function () { return streamer2.sendData({ Test2: "test2" }); }, 2000);
    // One method with arguments
    MyClass.prototype.foo = function (arg1, arg2) {
        return "The method foo is called on an instance of MyClass. Stored props: " + this._prop1 + ", " + this._prop2 + ". Arguments passed :" + arg1 + ", " + arg2;
    };
    // Another method, but we do not want it to be called remotely
    MyClass.prototype.bar = function () {
        return 'The method bar can be called ... but not remotely';
    };
    // Another method which returns a stream which can be listen by the callers
    MyClass.prototype.getAPreciousStream = function () {
        //streamCap.sendData({"Test" : "test"});
        return streamer;
    };
    // Another method which returns a stream which can be listen by the callers
    MyClass.prototype.getAnotherPreciousStream = function () {
        //streamCap.sendData({"Test" : "test"});
        return streamer2;
    };
    //
    // Init FarAwayJs (and activate console logs)
    //
    callee_1.farAwayCallee.debugOn();
    callee_1.farAwayCallee.setCommunication(wsCommunication);
    // Register the collables items
    callee_1.farAwayCallee.regFunction(test, "test");
    callee_1.farAwayCallee.regInstantiable(MyClass, ["bar"], "MyClass"); // ["bar"] is there to exclude the method bar from remote calls
});
//# sourceMappingURL=nodeJsCallee.js.map