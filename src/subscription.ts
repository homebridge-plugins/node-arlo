import { SubscribeProperties } from "./responses";

import { EventEmitter } from "events";

/**
 * Subscription.
 */
export class Subscription extends EventEmitter {

  /**
   * On.
   * @param event Event.
   * @param listener Listener.
   */
  on(event: 'cameras' | 'modes' | 'default', listener: (from: string, properties: SubscribeProperties) => void): this {
    return super.on(event, listener);
  }
}