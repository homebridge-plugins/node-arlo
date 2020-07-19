import { EventEmitter } from "events";

import { Arlo } from "..";
import { X_CLOUD_ID } from "../consts";

/**
 * Device.
 */
export abstract class Device extends EventEmitter {

  /**
   * ID.
   */
  id: string;

  /**
   * Cloud ID.
   */
  cloudId;

  /**
   * Constructor.
   * @param parent Parent.
   * @param device Device.
   */
  constructor(
    protected readonly parent: Arlo,
    protected readonly device
  ) {
    super();

    this.id = device.deviceId;
    this.cloudId = device[X_CLOUD_ID];
  }

  /**
   * Get model.
   */
  getModel() {
    return this.device.modelId;
  }

  /**
   * Get name.
   */
  getName() {
    return this.device.deviceName;
  }

  /**
   * Get serial number.
   */
  getSerialNumber() {
    return this.device.deviceId;
  }

  /**
   * Get type.
   */
  getType() {
    return this.device.deviceType;
  }
}