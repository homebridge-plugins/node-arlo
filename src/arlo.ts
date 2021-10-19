/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEmitter } from "events";

import { Logger } from "@epickris/node-logger";

import { Client } from "./client";
import { Subscription } from "./subscription";
import * as Devices from "./devices";
import * as Events from "./events";
import * as Responses from "./responses";

/**
 * Log
 */
const log = new Logger();

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
    listener: (arg: Responses.LoginData & (Devices.Basestation | Devices.Camera | Devices.Q)) => void
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
    } catch (error: any) {
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
    } catch (error: any) {
      throw new Error(error);
    }

    if (!devices || !devices.success || this.isErrorData(devices.data)) return;

    const unknownDeviceTypes: string[] = [];

    // First we process the parent devices.
    for (const data of devices.data) {
      if (this.isParentDeviceData(data)) {
        switch (data.deviceType) {
          case Responses.DeviceType.BASESTATION:
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
          case Responses.DeviceType.CAMERA:
            this.devices[data.deviceId] = new Devices.Camera(this.client, data);
            this.emit(Events.FOUND, this.devices[data.deviceId]);
            break;
          case Responses.DeviceType.Q:
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
      log.warn(`Unknown device type: ${unknownDeviceType}`);
    }

    return devices.data;
  }

  /**
   * Subscribe.
   */
  async subscribe(): Promise<Subscription> {
    const subscription = await this.client.getSubscribe();

    subscription.on('cameras', (from, properties) => {
      this.subscriptionEvent(from, properties, Events.CAMERA);
    });

    subscription.on('modes', (from, properties) => {
      this.subscriptionEvent(from, properties, Events.MODE);
    });

    subscription.on('subscriptions', (from, properties) => {
      this.subscriptionEvent(from, properties, Events.SUBSCRIPTION);
    });

    subscription.on('default', (from, properties) => {
      this.subscriptionEvent(from, properties, Events.DEFAULT);
    });

    return subscription;
  }

  /**
   * Subscription event.
   * @param from From.
   * @param properties Properties.
   * @param event Event.
   */
  private subscriptionEvent(from: string, properties: Responses.SubscribeProperties | Responses.SubscribeProperties[], event: string) {
    if (!Array.isArray(properties)) {
      properties = [properties];
    }

    for (const property of properties) {
      if(this.devices[from]) {
        this.devices[from].emit(event, property);

        if (property.hwVersion) {
          this.devices[from].emit(Events.HARDWARE_VERSION, property.hwVersion);
        }

        if (property.modelId) {
          this.devices[from].emit(Events.MODEL_ID, property.modelId);
        }

        if (property.serialNumber) {
          this.devices[from].emit(Events.SERIAL_NUMBER, property.serialNumber);
        }

        if (property.swVersion) {
          this.devices[from].emit(Events.SOFTWARE_VERSION, property.swVersion);
        }
      }
    }
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