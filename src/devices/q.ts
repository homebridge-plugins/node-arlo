/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from "../client";
import { ChildDevice } from "./device";
import * as Responses from "../responses";
import * as Resources from "../resources";

/**
 * Q.
 */
export class Q extends ChildDevice {

  /**
   * Siren on.
   */
  async sirenOn(): Promise<boolean> {
    let setSiren = false;
    try {
      setSiren = await this.setSiren(true, 300, 8);
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
      throw new Error(error);
    }

    if (!notify) return false;

    return notify;
  }

  /**
   * Child device constructor.
   * @param client Client.
   * @param data Data.
   */
  constructor(
    protected readonly client: Client,
    protected readonly data: Responses.ChildDeviceData
  ) {
    super(client, data);
  }

  /**
   * Get.
   */
  async get(): Promise<boolean> {
    let notify: boolean | null;
    try {
      notify = await this.client.createNotify(this.data.parentId, {
        from: `${this.data.userId}_web`,
        to: this.data.parentId,
        action: Resources.NotifyAction.GET,
        resource: `${Resources.NotifyResources.CAMERAS}/${this.data.deviceId}`,
        publish: true
      }, this.data.xCloudId)
    } catch (error: any) {
      throw new Error(error);
    }

    if (!notify) return false;

    return notify;
  }

  /**
   * Get snapshot.
   */
  async getSnapshot(): Promise<boolean> {
    let fullFrameSnapshot: boolean | null;
    try {
      fullFrameSnapshot = await this.client.createFullFrameSnapshot({
        from: `${this.data.userId}_web`,
        to: this.data.parentId,
        action: Resources.StartStreamAction.GET,
        resource: `${Resources.StartStreamResources.CAMERAS}/${this.data.deviceId}`,
        publish: true,
        transId: `node-arlo-${this.data.deviceId}!snapshot-${Date.now()}`,
        properties: {
          activityState: Resources.FullFrameSnapshotActivityState.FULL_FRAME_SNAPSHOT
        }
      }, this.data.xCloudId);
    } catch (error: any) {
      throw new Error(error);
    }

    if (!fullFrameSnapshot) return false;

    return fullFrameSnapshot;
  }

  /**
   * Get stream.
   */
  async getStream(): Promise<Responses.StartStreamData | undefined> {
    let startStream: Responses.StartStream | null;
    try {
      startStream = await this.client.createStartStream({
        from: `${this.data.userId}_web`,
        to: this.data.parentId,
        action: Resources.StartStreamAction.GET,
        resource: `${Resources.StartStreamResources.CAMERAS}/${this.data.deviceId}`,
        publish: true,
        transId: `node-arlo-${this.data.deviceId}!stream-${Date.now()}`,
        properties: {
          activityState: Resources.StartStreamActivityState.START_USER_STEAM,
          cameraId: this.data.deviceId
        }
      }, this.data.xCloudId);
    } catch (error: any) {
      throw new Error(error);
    }

    if (!startStream || !startStream.success || this.isErrorData(startStream.data)) return;

    return startStream.data;
  }

  /**
   * Set.
   * @param properties Properties.
   */
  async set(properties: Record<string, unknown>): Promise<boolean> {
    let notify: boolean | null;
    try {
      notify = await this.client.createNotify(this.data.parentId, {
        from: `${this.data.userId}_web`,
        to: this.data.parentId,
        action: Resources.NotifyAction.SET,
        resource: `${Resources.NotifyResources.CAMERAS}/${this.data.deviceId}`,
        publish: true,
        properties: properties
      }, this.data.xCloudId)
    } catch (error: any) {
      throw new Error(error);
    }

    if (!notify) return false;

    return notify;
  }

  /**
   * Set privacy active.
   * @param active Active?
   */
  async setPrivacyActive(active: boolean): Promise<boolean> {
    let set = false;
    try {
      set = await this.set({
        privacyActive: active
      });
    } catch (error: any) {
      throw new Error(error);
    }

    return set;
  }
}