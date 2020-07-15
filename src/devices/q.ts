import { BaseStation } from "./baseStation";
import { PUBLISH, PROPERTIES } from "../consts";
import * as Actions from "../actions";
import * as Resources from "../resources";

/**
 * Q.
 */
export class Q extends BaseStation {

  /**
   * Download snapshot.
   * @param url URL.
   * @param callback Callback.
   */
  downloadSnapshot(url: string, callback?: () => void): void {
    this.parent.downloadSnapshot(url, callback);
  }

  /**
   * Get.
   */
  get(): void {
    this.parent.notify(this.device.parentId, {
      [Actions.ACTION]: Actions.GET,
      [Resources.RESOURCE]: `${Resources.CAMERAS}/${this.id}`,
      [PUBLISH]: true
    });
  }

  /**
   * Get snapshot.
   * @param callback Callback.
   */
  getSnapshot(callback?: () => void): void {
    this.parent.getSnapshot(this.device, callback);
  }

  /**
   * Get stream.
   * @param callback Callback.
   */
  getStream(callback?: () => void): void {
    this.parent.getStream(this.device, callback);
  }

  /**
   * Set.
   * @param props Properties.
   * @param callback Callback.
   */
  set(props, callback?: () => void): void {
    this.parent.notify(this.device.parentId, {
      [Actions.ACTION]: Actions.SET,
      [Resources.RESOURCE]: `${Resources.CAMERAS}/${this.id}`,
      [PUBLISH]: true,
      [PROPERTIES]: props
    }, callback);
  }

  /**
   * Set privacy active.
   * @param value Value.
   * @param callback Callback.
   */
  setPrivacyActive(value, callback?: () => void): void {
    this.set({
      privacyActive: value
    }, callback);
  }
}