"use strict";

const Constants = require("./ArloConstants");
const ArloBaseStation = require("./ArloBaseStation");

class ArloQ extends ArloBaseStation {
  constructor(device, parent) {
    super(device, parent);
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

  getSnapshot(callback) {
    this.parent.getSnapshot(this.device, callback);
  }

  getStream(callback) {
    this.parent.getStream(this.device, callback);
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

module.exports = ArloQ;
