import { EventEmitter } from "events";

const customEventEmitter = new EventEmitter();

customEventEmitter.on('response', (name) => {
    console.log(`Data recieved. ${name}`)
})

customEventEmitter.on('response', () => {
    console.log('Data recieved -2.')
})

customEventEmitter.emit("response", 'john')