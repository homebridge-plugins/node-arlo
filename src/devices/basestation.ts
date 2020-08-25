import { ParentDevice } from "./device";
import * as Resources from "../resources";

/**
 * Basestation.
 */
export class Basestation extends ParentDevice {

  /**
   * Siren on.
   */
  async sirenOn(): Promise<boolean> {
    let setSiren = false;
    try {
      setSiren = await this.setSiren(true, 300, 8);
    } catch (error) {
      throw new Error(error);
    }

    return setSiren;
  }

  /**
   * Siren off.
   */
  async sirenOff(): Promise<boolean> {
    let setSiren = false;
    try {
      setSiren = await this.setSiren(false, 300, 8);
    } catch (error) {
      throw new Error(error);
    }

    return setSiren;
  }

  /**
   * Set siren.
   * @param state State.
   * @param duration Duration.
   * @param volume Volume.
   */
  async setSiren(state: boolean, duration: number, volume: number): Promise<boolean> {
    let notify: boolean | null;
    try {
      notify = await this.client.createNotify(this.data.deviceId, {
        from: `${this.data.userId}_web`,
        to: this.data.deviceId,
        action: Resources.NotifyAction.SET,
        resource: Resources.NotifyResources.SIREN,
        publish: true,
        properties: {
          sirenState: state ? Resources.NotifySirenStates.ON : Resources.NotifySirenStates.OFF,
          duration: duration,
          volume: volume,
          pattern: Resources.NotifyPattern.ALARM
        }
      }, this.data.xCloudId);
    } catch (error) {
      throw new Error(error);
    }

    if (!notify) return false;

    return notify;
  }

  /**
   * Arm.
   */
  async arm(): Promise<boolean> {
    let setMode = false;
    try {
      setMode = await this.setMode(Resources.NotifyModes.ARMED);
    } catch (error) {
      throw new Error(error);
    }

    return setMode;
  }

  /**
   * Disarm.
   */
  async disarm(): Promise<boolean> {
    let setMode = false;
    try {
      setMode = await this.setMode(Resources.NotifyModes.DISARMED);
    } catch (error) {
      throw new Error(error);
    }

    return setMode;
  }

  /**
   * Set mode.
   * @param mode Mode.
   */
  async setMode(mode: string | Resources.NotifyModes): Promise<boolean> {
    let notify: boolean | null;
    try {
      notify = await this.client.createNotify(this.data.deviceId, {
        from: `${this.data.userId}_web`,
        to: this.data.deviceId,
        action: Resources.NotifyAction.SET,
        resource: Resources.NotifyResources.MODES,
        publish: true,
        properties: {
          active: mode
        }
      }, this.data.xCloudId);
    } catch (error) {
      throw new Error(error);
    }

    if (!notify) return false;

    return notify;
  }

  /**
   * Subscribe.
   */
  async subscribe(): Promise<boolean> {
    let notify: boolean | null;
    try {
      notify = await this.client.createNotify(this.data.deviceId, {
        from: `${this.data.userId}_web`,
        to: this.data.deviceId,
        action: Resources.NotifyAction.GET,
        resource: Resources.NotifyResources.SUBSCRIPTIONS,
        publish: false,
        properties: {
          devices: [this.data.deviceId]
        }
      }, this.data.xCloudId);
    } catch (error) {
      throw new Error(error);
    }

    if (!notify) return false;

    return notify;
  }
}