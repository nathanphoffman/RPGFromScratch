

const EVENTS = ["MOVE"] as const;
type EventName = typeof EVENTS[number];

type Listener<T extends object> = (signature: T) => void;
type EventRegistry = {[key in EventName]?: [Listener<object>]};

let EVENT_REGISTRY : EventRegistry = {};

export function event(eventName: EventName) {

    const event = Object.keys(EVENT_REGISTRY).find((_eventName)=>_eventName === eventName);

    return {
        on(listener: Listener<object>) {

            if(!event) {
                EVENT_REGISTRY[eventName] = [listener];
            }
            else {
                EVENT_REGISTRY[eventName]?.push(listener);
            }
        },

        executeEvent(obj: object) {
            if(!event) throw `Event ${event} is not being listened to`;

            const events = EVENT_REGISTRY[event as EventName];
            events?.forEach(event=>event(obj))
        }
    }
}
