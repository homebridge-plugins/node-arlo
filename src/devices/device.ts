import { EventEmitter } from "events";

import { Client } from "../client";
import * as Responses from "../responses";

/**
 * Device.
 */
export abstract class Device extends EventEmitter {

  /**
   * Device constructor.
   * @param client Client.
   * @param data Data.
   */
  constructor(
    protected readonly client: Client,
    protected readonly data: Responses.ParentDeviceData | Responses.ChildDeviceData
  ) {
    super();
  }

  /**
   * Get ID.
   */
  get id(): string {
    return this.data.deviceId;
  }

  /**
   * Get unique ID.
   */
  get uniqueId(): string {
    return this.data.uniqueId;
  }

  /**
   * Get type.
   */
  get type(): Responses.DeviceType {
    return this.data.deviceType;
  }

  /**
   * Get name.
   */
  get name(): string {
    return this.data.deviceName;
  }

  /**
   * Get model ID.
   */
  get modelId(): string {
    return this.data.modelId;
  }

  /**
   * Get hardware version.
   */
  get hardwareVersion(): string {
    return this.data.properties.hwVersion;
  }

  /**
   * On.
   * @param event Event.
   * @param listener Listener.
   */
  on(
    event: 'camera' | 'hardwareVersion' | 'mode' | 'modelId' | 'serialNumber' | 'softwareVersion' | 'subscription' | 'default',
    listener: (from: string, arg: Responses.SubscribeProperties | string) => void
  ): this {
    return super.on(event, listener);
  }

  /**
   * Is error data?
   * @param data Data.
   */
  protected isErrorData(data: Responses.ErrorData | unknown): data is Responses.ErrorData {
    return (data as Responses.ErrorData).error !== undefined;
  }
}

/**
 * Parent device.
 */
export abstract class ParentDevice extends Device {

  /**
   * Parent device constructor.
   * @param client Client.
   * @param data Data.
   */
  constructor(
    protected readonly client: Client,
    protected readonly data: Responses.ParentDeviceData
  ) {
    super(client, data);
  }

  /**
   * Get firmware version.
   */
  get firmwareVersion(): string {
    return this.data.firmwareVersion;
  }
}

/**
 * Child device.
 */
export abstract class ChildDevice extends Device {

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
}