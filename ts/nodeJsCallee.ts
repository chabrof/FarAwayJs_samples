import { farAwayCallee } from "FarAwayJs/js/callee"
import { WSS } from "FarAwayJs/js/communications/callee/wss"
import { SimpleStream } from "FarAwayJs/js/back_create/callee/simple_stream"
import { FACalleeCommunication } from "FarAwayJs/js/interfaces"

// We define a very simple function
function test(arg1, arg2) {
  return `Success (args : ${arg1} , ${arg2}`
}

//
// Here we define an instantiable object
//
function MyClass(arg1, arg2) {
  this._prop1 = arg1
  this._prop2 = arg2
}

let wsCommunication :FACalleeCommunication = new WSS('localhost', '8080')

// Create of a simpleStreamer, and send data every 2 sec period
let streamer = new SimpleStream("localhost", "8080")
streamer.setCommunication(wsCommunication) // the communication instance can be used and shared with the FarAway instance
setInterval(() => streamer.sendData({Test : "test"}), 2000)

let streamer2 = new SimpleStream("localhost", "8080")
streamer2.setCommunication(wsCommunication) // the communication instance can be used and shared with the FarAway instance
setInterval(() => streamer2.sendData({Test2 : "test2"}), 2000)

// One method with arguments
MyClass.prototype.foo = function(arg1 :any, arg2 :any) {
  return `The method foo is called on an instance of MyClass. Stored props: ${this._prop1}, ${this._prop2}. Arguments passed :${arg1}, ${arg2}`
}

// Another method, but we do not want it to be called remotely
MyClass.prototype.bar = function() {
  return 'The method bar can be called ... but not remotely'
}

// Another method which returns a stream which can be listen by the callers
MyClass.prototype.getAPreciousStream = function() :SimpleStream {
  //streamCap.sendData({"Test" : "test"});
  return streamer
}

// Another method which returns a stream which can be listen by the callers
MyClass.prototype.getAnotherPreciousStream = function() :SimpleStream {
  //streamCap.sendData({"Test" : "test"});
  return streamer2
}


//
// Init FarAwayJs (and activate console logs)
//
farAwayCallee.debugOn()
farAwayCallee.setCommunication(wsCommunication)

// Register the collables items
farAwayCallee.regFunction(test, "test")
farAwayCallee.regInstantiable(MyClass, ["bar"], "MyClass") // ["bar"] is there to exclude the method bar from remote calls
