import {pinoLogger} from "../presentation/shared/pino-logger";

export class MockBroker {
    private events: any[] = [];

    publish(eventName: string, payload: any) {
        pinoLogger.info({ eventName, payload }, "Event published");
        this.events.push({eventName, payload});
    }

    getEvents() {
        return this.events;
    }
}

//  TODO: event overflow
// get last event
// handle push bug
// queue structure