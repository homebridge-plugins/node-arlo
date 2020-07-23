import { EventEmitter } from "events";

import { Client } from "./client";
import { Subscription } from "./subscription";
import * as Devices from "./devices";
import * as Events from "./events";
import * as Responses from "./responses";
import { Device, ChildDevice } from "./devices/device";

/**
 * Arlo.
 */
export class Arlo extends EventEmitter {

  /**
   * Client.
   */
  private client: Client;

  /**
   * Login data.
   */
  private loginData?: Responses.LoginData;

  /**
   * Devices.
   */
  private devices: Record<string, Devices.Basestation | Devices.Camera | Devices.Q> = {};

  /**
   * Arlo constructor.
   */
  constructor() {
    super();

    this.client = new Client();
  }

  /**
   * On.
   * @param event Event.
   * @param listener Listener.
   */
  on(
    event: 'login' | 'found',
    listener: (arg: Responses.LoginData | Record<string, Devices.Basestation | Devices.Camera | Devices.Q>) => void
  ): this {
    return super.on(event, listener);
  }

  /**
   * Login.
   * @param email Email.
   * @param password Password.
   */
  async login(email: string, password: string): Promise<Responses.LoginData | undefined> {
    let login: Responses.Login | null;
    try {
      login = await this.client.createLogin(email, password);
    } catch (error) {
      throw new Error(error);
    }

    if (!login || !login.success || !(this.isLoginData(login.data))) return;

    this.loginData = login.data;
    this.client.token = login.data.token;

    this.emit(Events.LOGIN, login.data);

    return this.loginData;
  }

  /**
   * Get devices.
   */
  async getDevices(): Promise<(Responses.ParentDeviceData | Responses.ChildDeviceData)[] | undefined> {
    let devices: Responses.Devices | null;
    try {
      devices = await this.client.getDevices();
    } catch (error) {
      throw new Error(error);
    }

    if (!devices || !devices.success || this.isErrorData(devices.data)) return;

    const unknownDeviceTypes: string[] = [];

    // First we process the parent devices.
    for (const data of devices.data) {
      if (this.isParentDeviceData(data)) {
        switch (data.deviceType) {
          case Responses.DeviceTypes.BASESTATION:
            this.devices[data.deviceId] = new Devices.Basestation(this.client, data);
            (this.devices[data.deviceId] as Devices.Basestation).subscribe();
            this.emit(Events.FOUND, this.devices[data.deviceId]);
            break;
          default:
            if (unknownDeviceTypes.includes(data.deviceType)) unknownDeviceTypes.push(data.deviceType);
        }
      }
    }

    // Then we process the child devices.
    for (const data of devices.data) {
      if (this.isChildDeviceData(data)) {
        switch (data.deviceType) {
          case Responses.DeviceTypes.CAMERA:
            this.devices[data.deviceId] = new Devices.Camera(this.client, data);
            this.emit(Events.FOUND, this.devices[data.deviceId]);
            break;
          case Responses.DeviceTypes.Q:
            this.devices[data.deviceId] = new Devices.Q(this.client, data);
            (this.devices[data.deviceId] as Devices.Q).subscribe();
            this.emit(Events.FOUND, this.devices[data.deviceId]);
            break;
          default:
            if (unknownDeviceTypes.includes(data.deviceType)) unknownDeviceTypes.push(data.deviceType);
        }
      }
    }

    for (const unknownDeviceType of unknownDeviceTypes) {
      console.warn(`Unknown device type: ${unknownDeviceType}`);
    }

    return devices.data;
  }

  /**
   * Subscribe.
   */
  async subscribe(): Promise<Subscription> {
    const subscription = await this.client.getSubscribe();

    subscription.on('cameras', (from, properties) => {
      if (properties.serialNumber) {
        if(this.devices[properties.serialNumber]) {
          this.devices[properties.serialNumber].emit(Events.CAMERAS, properties);
        }
      }
    });

    subscription.on('modes', (from, properties) => {
      if (this.devices[from]) {
        this.devices[from].emit(Events.MODES);
      }
    });

    subscription.on('default', (from, properties) => {
      // TODO
    });

    return subscription;
  }

  /**
   * Is error data?
   * @param data Data.
   */
  private isErrorData(data: Responses.ErrorData | unknown): data is Responses.ErrorData {
    return (data as Responses.ErrorData).error !== undefined;
  }

  /**
   * Is login data?
   * @param data Data.
   */
  private isLoginData(data: Responses.LoginData | Responses.ErrorData): data is Responses.LoginData {
    return !this.isErrorData(data);
  }

  /**
   * Is parent device data?
   * @param deviceData Device data.
   */
  private isParentDeviceData(deviceData: Responses.ParentDeviceData | Responses.ChildDeviceData): deviceData is Responses.ParentDeviceData {
    return !this.isChildDeviceData(deviceData);
  }

  /**
   * Is child device data?
   * @param deviceData Device data.
   */
  private isChildDeviceData(deviceData: Responses.ParentDeviceData | Responses.ChildDeviceData): deviceData is Responses.ChildDeviceData {
    return (deviceData as Responses.ChildDeviceData).parentId !== undefined;
  }
}