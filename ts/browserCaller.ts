import { WS } from "FarAwayJs/communications/caller/ws"
import { farAwayCaller } from "FarAwayJs/caller"
import { FACallerCommunication, CallerBackCreate } from "FarAwayJs/interfaces"
import { SimpleStream } from "FarAwayJs/back_create/caller/simple_stream"

export function main() {

  // Activate console logs
  farAwayCaller.debugOn()
  let wsCommunication :FACallerCommunication = new WS('localhost', '8080')
  farAwayCaller.setCommunication(wsCommunication)
  farAwayCaller.regBackCreateObject("SimpleStream", SimpleStream as CallerBackCreate)

  farAwayCaller.farImport(["test", "MyClass"])
    .then(() => {
        farAwayCaller.farCall("test", ['argu1', 'argu2'])
          .then((result) => console.log(result))
          .then(nextStep)
      })
}

// In the next step, we try to instantiate remotely a tiny object, and to use its method
function nextStep() {

  farAwayCaller.farInstantiate("MyClass", ['argConstruct1', 'argConstruct2'])
    .then((myClass) => {
        console.log('Try to call methods of a freshly instantiated object');

        (myClass as any).farCall("foo", ['arg1', 'arg2'])
          .then((result) => console.log('Result of method call', result))
          .then(() => (myClass as any).farCall("getAPreciousStream"))
          .then((stream) => { console.log('Stream', stream); return stream })
          .then((stream) => listenToStream(stream));

        // in parallel get another stream
        (myClass as any).farCall("getAnotherPreciousStream")
          .then((stream) => listenToStream(stream))

      })
}

function listenToStream(stream :SimpleStream) {

  function listener(message) {
    console.log('Message from stream', message);
  }

  stream.addEventListener(listener);
}
