import { ChildDevice } from "./device";
import * as Responses from "../responses";
import * as Resources from "../resources";

/**
 * Camera.
 */
export class Camera extends ChildDevice {

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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      throw new Error(error);
    }

    return set;
  }
}