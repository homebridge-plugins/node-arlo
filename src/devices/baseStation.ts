import { Device } from "./device";
import { ACTIVE, DEVICES, DURATION, PROPERTIES, PUBLISH, SIREN_OFF, SIREN_ON, SIREN_STATE, VOLUME } from "../consts";
import * as Actions from "../actions";
import * as Modes from "../modes";
import * as Patterns from "../patterns";
import * as Resources from "../resources";

import { RequestCallback } from "request";

/**
 * Base station.
 */
export class BaseStation extends Device {

  /**
   * Is subsccribed?
   */
  isSubscribed = false;

  /**
   * Arm.
   * @param callback Callback.
   */
  arm(callback?: () => void): void {
    this.setMode(Modes.ARMED, callback);
  }

  /**
   * Disarm.
   * @param callback Callback.
   */
  disarm(callback?: () => void): void {
    this.setMode(Modes.DISARMED, callback);
  }

  /**
   * Alarm on.
   * @param callback Callback.
   */
  alarmOn(callback?: () => void): void {
    this.setSirenState(true, 300, 8, Patterns.ALARM, callback);
  }

  /**
   * Alarm off.
   * @param callback Callback.
   */
  alaramOff(callback?: () => void): void {
    this.setSirenState(false, 300, 8, Patterns.ALARM, callback);
  }

  /**
   * Set mode.
   * @param mode Mode.
   * @param callback Callback.
   */
  setMode(mode: string, callback?: (body) => void): void {
    this.parent.notify(this, {
      [Actions.ACTION]: Actions.SET,
      [Resources.RESOURCE]: Resources.MODES,
      [PUBLISH]: true,
      [PROPERTIES]: {
        [ACTIVE]: mode
      }
    }, (error, response, body) => {
      if (typeof callback === 'function') {
        callback(body);
      }
    });
  }

  /**
   * Set siren state.
   * @param enabled Enabled?
   * @param duration Duration.
   * @param volume Volume.
   * @param pattern Pattern.
   * @param callback Callback.
   */
  setSirenState(enabled: boolean, duration: number, volume: number, pattern: string, callback?: (body) => void): void {
    this.parent.notify(this, {
      [Actions.ACTION]: Actions.SET,
      [Resources.RESOURCE]: Resources.SIREN,
      [PUBLISH]: true,
      [PROPERTIES]: {
        [SIREN_STATE]: enabled ? SIREN_ON : SIREN_OFF,
        [DURATION]: duration,
        [VOLUME]: volume,
        [Patterns.PATTERN]: pattern
      }
    }, (error, response, body) => {
      if (typeof callback === 'function') {
        callback(body);
      }
    });
  }

  /**
   * Subscribe.
   * @param callback Callback.
   */
  subscribe(callback?: RequestCallback): void {
    this.parent.notify(this, {
      [Actions.ACTION]: Actions.GET,
      [Resources.RESOURCE]: Resources.SUBSCRIPTIONS,
      [PUBLISH]: false,
      [PROPERTIES]: {
        [DEVICES]: [this.id]
      }
    }, callback);
  }
}