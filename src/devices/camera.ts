import { Device } from "./device";
import { PROPERTIES, PUBLISH } from "../consts";
import * as Actions from "../actions";
import * as Resources from "../resources";

/**
 * Camera.
 */
export class Camera extends Device {

  /**
   * Get snapshot.
   * @param callback Callback.
   */
  getSnapshot(callback?: () => void): void {
    console.debug('Get snapshot');
    this.parent.getSnapshot(this.device, callback);
  }

  /**
   * Get stream.
   * @param callback Callback.
   */
  getStream(callback?: () => void): void {
    console.debug('Get stream');
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
    }, callback)
  }

  /**
   * Set privacy active.
   * @param value Value.
   * @param callbacck Callback
   */
  setPrivacyActive(value, callbacck?: () => void): void {
    this.set({
      privacyActive: value
    }, callbacck);
  }
}