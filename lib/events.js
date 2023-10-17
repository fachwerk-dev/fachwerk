import mitt from "mitt";

const emitter = mitt();

/**
 * Emits an event with a specified name and payload.
 *
 * @param {string} name - The name of the event to be emitted.
 * @param {*} payload - The data to be sent with the event.
 */
export function emit(name, payload) {
  emitter.emit(name, payload);
}

/**
 * Registers an event handler for a specified event name.
 *
 * @param {string} name - The name of the event to listen for.
 * @param {function} [handler=() => {}] - The callback function to be executed when the event is triggered. Defaults to an empty function.
 */
export function on(name, handler = () => {}) {
  emitter.on(name, handler);
}
