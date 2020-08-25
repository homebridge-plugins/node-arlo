"use strict";

const EventEmitter = require("events").EventEmitter;
const debug = require("debug")("Arlo:Camera");

const Constants = require("./ArloConstants");

class ArloCamera extends EventEmitter {
  constructor(device, parent) {
    super();

    this.id = device.deviceId;
    this.cloudId = device[Constants.XCLOUD_ID];

    this.parent = parent;
    this.device = device;
  }

  downloadSnapshot(url, callback) {
    this.parent.downloadSnapshot(url, callback);
  }

  get() {
    this.parent.notify(this.device.parentId, {
      [Constants.ACTION]: Constants.ACTION_GET,
      [Constants.RESOURCE]: Constants.RESOURCE_CAMERAS + "/" + this.id,
      [Constants.PUBLISH]: true,
    });
  }

  getModel() {
    return this.device.modelId;
  }

  getName() {
    return this.device.deviceName;
  }

  getSerialNumber() {
    return this.device.deviceId;
  }

  getSnapshot(callback) {
    debug("Get snapshot");
    this.parent.getSnapshot(this.device, callback);
  }

  getStream(callback) {
    debug("Get stream");
    this.parent.getStream(this.device, callback);
  }

  getType() {
    return this.device.deviceType;
  }

  set(props, callback) {
    this.parent.notify(
      this.device.parentId,
      {
        [Constants.ACTION]: Constants.ACTION_SET,
        [Constants.RESOURCE]: Constants.RESOURCE_CAMERAS + "/" + this.id,
        [Constants.PUBLISH]: true,
        [Constants.PROPERTIES]: props,
      },
      callback
    );
  }

  setPrivacyActive(value, callback) {
    this.set({ privacyActive: value }, callback);
  }
}

module.exports = ArloCamera;
