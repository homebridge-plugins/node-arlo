"use strict";

const EventEmitter = require('events').EventEmitter;

const Constants = require('./ArloConstants');
const debug = require('debug')('Arlo:BaseStation');

class ArloBaseStation extends EventEmitter {
    constructor(device, parent) {
        super();

        this.id = device.deviceId;
        this.cloudId = device[Constants.XCLOUD_ID];

        this.parent = parent;
        this.device = device;
        this.isSubscribed = false;
    }
    
    arm(callback) {
        this.setMode(Constants.MODE_ARMED, callback);
    }

    disarm(callback) {
        this.setMode(Constants.MODE_DISARMED, callback);
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

    getType() {
        return this.device.deviceType;
    }

    setMode(mode, callback) {
        this.parent.notify(
            this,
            {
                [Constants.ACTION]     : Constants.ACTION_SET,
                [Constants.RESOURCE]   : Constants.RESOURCE_MODES,
                [Constants.PUBLISH]    : true,
                [Constants.PROPERTIES] : {[Constants.ACTIVE]: mode}
            },
            function(error, response, body) {
                if (typeof(callback) == 'function') {
                    callback(body);
                }
            }.bind(this)
        );
    }

    subscribe(callback) {
        this.parent.notify(
            this,
            {
                [Constants.ACTION]     : Constants.ACTION_SET,
                [Constants.RESOURCE]   : Constants.RESOURCE_SUBSCRIPTIONS + "/" + this.parent.userId + "_web",
                [Constants.PUBLISH]    : false,
                [Constants.PROPERTIES] : {
                    [Constants.DEVICES]: [this.id]
                }
            },
            callback
        );
    }
}

module.exports = ArloBaseStation;
