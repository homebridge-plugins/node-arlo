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