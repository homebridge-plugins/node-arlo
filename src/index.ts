import { EventEmitter } from 'events';
import { Url } from 'url';

import { USER_AGENT } from './settings';
import {
  ACTIVITY_STATE,
  CAMERA_ID,
  FF_SNAPSHOT,
  FF_SNAPSHOT_AVAILABLE,
  FROM,
  TO,
  PROPERTIES,
  PUBLISH,
  TRANS_ID,
  X_CLOUD_ID
} from './consts';
import * as DeviceTypes from './deviceTypes';
import * as Actions from './actions';
import * as Events from './events';
import * as Modes from './modes';
import * as Urls from './urls';
import * as Resources from './resources';
import * as Devices from './devices';
import { Device } from './devices/device';

import { default as Request, RequestCallback } from 'request';

/**
 * Arlo.
 */
export class Arlo extends EventEmitter {

  /**
   * Armed mode.
   */
  readonly ARMED = Modes.ARMED;

  /**
   * Disarmed mode.
   */
  readonly DISARMED = Modes.DISARMED;

  /**
   * Base station device type.
   */
  readonly BASESTATION = DeviceTypes.BASE_STATION;

  /**
   * Camera device type.
   */
  readonly CAMERA = DeviceTypes.CAMERA;

  /**
   * Q device type.
   */
  readonly Q = DeviceTypes.Q;

  /**
   * Siren device type.
   */
  readonly SIREN = DeviceTypes.SIREN;

  /**
   * Audio event.
   */
  readonly AUDIO = Events.AUDIO;

  /**
   * Battery event.
   */
  readonly BATTERY = Events.BATTERY;

  /**
   * Charging event.
   */
  readonly CHARGING = Events.CHARGING;

  /**
   * Found event.
   */
  readonly FOUND = Events.FOUND;

  /**
   * Motion event.
   */
  readonly MOTION = Events.MOTION;

  /**
   * Update event.
   */
  readonly UPDATE = Events.UPDATE;

  /**
   * Snapshot.
   */
  readonly FF_SNAPSHOT = FF_SNAPSHOT_AVAILABLE;

  /**
   * Devices.
   */
  devices = {};

  /**
   * Pending snapshots.
   */
  pendingSnapshots = {};

  /**
   * User ID.
   */
  userId;

  /**
   * Token.
   */
  token;

  /**
   * Headers.
   */
  headers = {
    'User-Agent': USER_AGENT
  };

  /**
   * Get devices.
   * @param callback Callback.
   */
  getDevices(callback?: () => void): void {
    this.get(Urls.DEVICES, {}, (error, response, body) => {
      if (!body || !body.success) return;

      for (const device of body.data) {
        switch (device.deviceType) {
          case DeviceTypes.BASE_STATION:
            this.devices[device.deviceId] = new Devices.BaseStation(this, device);
            this.devices[device.deviceId].subscribe();
            this.emit(Events.FOUND, this.devices[device.deviceId]);
            break;
          case DeviceTypes.CAMERA:
            this.devices[device.deviceId] = new Devices.Camera(this, device);
            this.emit(Events.FOUND, this.devices[device.deviceId]);
            break;
          case DeviceTypes.Q:
            this.devices[device.deviceId] = new Devices.Q(this, device);
            this.devices[device.deviceId].subscribe();
            this.emit(Events.FOUND, this.devices[device.deviceId]);
            break;
        }
      }

      this.emit(Events.GOT_DEVICES, this.devices);

      if (typeof callback === 'function') {
          callback();
      }
    });
  }

  /**
   * Login.
   * @param username Username.
   * @param password Password.
   * @param callback Callback.
   */
  login(username: string, password: string, callback?: () => void): void {
    this.post(Urls.LOGIN, {
      email: username,
      password: password
    }, {}, (error, response, body) => {
      this.userId = body.data.userId;
      this.token = body.data.token;
      this.headers['Authorization'] = this.token;

      this.emit(Events.LOGGED_IN, body.data.serialNumber);

      this.subscribe(() => {
        this.getDevices();
      });

      if (typeof callback === 'function') {
        callback();
      }
    });
  }

  /**
   * Subscribe.
   * @param callback Callback.
   */
  subscribe(callback?: () => void): void {
    const reCamera = /cameras\/(.+)$/;
    const reSubscription = /subscriptions\/(.+)$/;

    Request.get({
      url: `${Urls.SUBSCRIBE}?token=${this.token}`,
      json: false,
      jar: true,
      headers: {
        ...this.headers,
        'Accept': 'text/event-stream'
      }
    }).on('data', (data) => {
      let str;
      let msg;

      if (typeof callback === 'function') {
        callback();
      }

      try {
        str = `{${data.toString().replace(/^event: message\s*data/, '"event": "message", "data"')}}`;
        msg = JSON.parse(str);
      } catch (error) {
        console.error(error);
        console.debug(str);
        return;
      }

      switch (msg.data.resource) {
        case Resources.CAMERAS:
          for (const property of msg.data.properties) {
            if (this.devices[property.serialNumber]) {
                this.devices[property.serialNumber].emit(Events.UPDATE, property);
            }
          }
          break;
        case Resources.MODES:
          if (this.devices[msg.data.from]) {
            this.devices[msg.data.from].emit(msg.data.properties.activeMode);
          }
          break;
        default:
          if (reSubscription.test(msg.data.resource)) {
            if (this.devices[msg.data.from]) {
              this.devices[msg.data.from].isSubsccribed = true;
            }
          } else if (reCamera.test(msg.data.resource)) {
            const [, deviceId] = msg.data.resource.match(reCamera);

            if (!msg.data.properties) return;

            if (this.devices[deviceId]) {
              switch (msg.data.action) {
                case FF_SNAPSHOT_AVAILABLE:
                    this.devices[deviceId].emit(FF_SNAPSHOT_AVAILABLE, msg.data.properties.presignedFullFrameSnapshotUrl);
                  break;
                case 'is':
                  if (msg.data.properties.activityState === FF_SNAPSHOT) {
                    const callback = this.pendingSnapshots[msg.data.transId];
                    delete this.pendingSnapshots[msg.data.transId];

                    if (typeof callback === 'function') {
                      callback(msg.data.error, msg.data);
                    }

                    return;
                  }

                  if (msg.data.properties[Events.AUDIO]) {
                    this.devices[deviceId].emit(Events.AUDIO, msg.data.properties[Events.AUDIO]);
                  }

                  if (msg.data.properties[Events.BATTERY]) {
                    this.devices[deviceId].emit(Events.BATTERY, msg.data.properties[Events.BATTERY]);
                  }

                  if (msg.data.properties[Events.CHARGING]) {
                    this.devices[deviceId].emit(Events.CHARGING, msg.data.properties[Events.CHARGING]);
                  }

                  if (msg.data.properties[Events.MOTION]) {
                    this.devices[deviceId].emit(Events.MOTION, msg.data.properties[Events.MOTION]);
                  }

                  this.devices[deviceId].emit(Events.UPDATE, msg.data.properties);
                  break;
              }
            }
          }
      }
    }).on('error', (error) => {
      console.error(error);
    });
  }

  /**
   * Download snapshot.
   * @param url URL.
   * @param callback Callback. 
   */
  downloadSnapshot(url: string, callback?: (buffer: Buffer) => void): void {
    const bufs: any[] = [];

    Request.get(url).on('data', (data) => {
      bufs.push(data);
    }).on('end', () => {
      if (typeof callback === 'function') {
        callback(Buffer.concat(bufs));
      }
    })
  }

  getSnapshot(device, callback?: () => void, label = 'node-arlo'): void {
    const parentDevice = this.devices[device.parentId];

    const transId = `${label}-${device.deviceId}!snapshot-${Date.now()}`;

    const body = {
      [FROM]: `${this.userId}_web`,
      [TO]: parentDevice.id,
      [Actions.ACTION]: Actions.SET,
      [Resources.RESOURCE]: `${Resources.CAMERAS}/${device.deviceId}`,
      [PUBLISH]: true,
      [TRANS_ID]: transId,
      [PROPERTIES]: {
        [ACTIVITY_STATE]: FF_SNAPSHOT
      }
    };

    this.post(Urls.SNAPSHOT, body, {
      [X_CLOUD_ID]: parentDevice.cloudId
    }, (error, response, data) => {
      if (data && data.success) {
        this.pendingSnapshots[transId] = callback;
      } else if (typeof callback === 'function') {
        callback();
      }
    });
  }

  getStream(device, callback?: (url: string) => void, label = 'node-arlo'): void {
    console.debug(`Device: ${device}`);

    const body = {
      [FROM]: `${this.userId}_web`,
      [TO]: device.parentId,
      [Actions.ACTION]: Actions.SET,
      [Resources.RESOURCE]: `${Resources.CAMERAS}/${device.deviceId}`,
      [PUBLISH]: true,
      [TRANS_ID]: `${label}-${device.deviceId}!stream-${Date.now()}`,
      [PROPERTIES]: {
        [ACTIVITY_STATE]: 'startUserStream',
        [CAMERA_ID]: device.deviceId
      }
    };

    console.debug('Getting stream');

    this.post(Urls.STREAM, body, {
      [X_CLOUD_ID]: device.xCloudId
    }, (error, response, body) => {
      if (error) {
        console.error(`Error getting stream: ${error}`);
        return;
      }

      if (!body.data.url) {
        console.debug('Error getting stream.');
        return;
      }

      if (typeof callback === 'function') {
        const url = body.data.url.replace('rtsp://', 'rtsps://');

        console.debug(`Got stream URL: ${url}`);

        callback(url);
      }
    });
  }

  /**
   * Notify.
   * @param device Device.
   * @param body Body.
   * @param callback Callback.
   */
  notify(device: Device, body, callback?: RequestCallback): void {
    try {
      if (typeof device === 'string') {
        device = this.devices[device];
      }

      body[FROM] = this.userId + '_web';
      body[TO] = device.id;

      this.post(`${Urls.NOTIFY}/${device.id}`, body, {
        [X_CLOUD_ID]: device.cloudId
      }, callback);
    } catch (error) {
      console.error(error);
      console.error(device);
    }
  }

  /**
   * Get.
   * @param url URL.
   * @param headers Headers.
   * @param callback Callback.
   */
  private get(url: string | Url, headers: Record<string, string>, callback?: RequestCallback) {
    const options = {
      url: url,
      method: 'GET',
      json: true,
      jar: true,
      headers: {
        ...this.headers,
        ...headers
      }
    }

    console.debug(options);

    Request.get(options, (error, response, body) => {
      console.debug(body);

      if (typeof callback === 'function') {
        callback(error, response, body);
      }
    });
  }

  /**
   * Post.
   * @param url URL.
   * @param body Body.
   * @param headers Headers.
   * @param callback Callback.
   */
  private post(url: string | Url, body, headers: Record<string, string>, callback?: RequestCallback) {
    const options = {
      url: url,
      method: 'POST',
      body: body,
      json: true,
      jar: true,
      headers: {
        ...this.headers,
        ...headers
      }
    }

    console.debug(options);

    Request.post(options, (error, response, body) => {
      console.debug(body);

      if (typeof callback === 'function') {
        callback(error, response, body);
      }
    });
  }
}