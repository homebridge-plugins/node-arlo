import { Basestation } from './basestation';
import { Client } from '../client';
import { ParentDeviceData, DeviceTypes } from '../responses';

describe(Basestation, () => {
    
  it('Should convert to JSON', () => {
    const client = new Client();
    const deviceData: ParentDeviceData = {
      userId: 'USER-ID',
      deviceId: 'DEVICE-ID',
      uniqueId: 'UNIQUE-ID',
      deviceType: DeviceTypes.BASESTATION,
      deviceName: 'Basestation',
      lastModified: new Date(),
      xCloudId: 'X-CLOUD-ID',
      lastImageUploaded: '',
      userRole: '',
      displayOrder: 1,
      mediaObjectCount: 0,
      state: '',
      modelId: 'MODEL-ID',
      cvrEnabled: true,
      dateCreated: new Date(),
      interfaceVersion: 'v0.0.0',
      interfaceSchemaVer: 'v0.0.0',
      owner: {
        firstName: 'Kristian',
        lastName: 'Matthews',
        ownerId: 'OWNER-ID'
      },
      properties: {
        modelId: 'MODEL-ID',
        olsonTimeZone: '',
        hwVersion: 'v0.0.0'
      },
      firmwareVersion: 'v0.0.0',
      timeZone: '',
      connectivity: {
        type: '',
        connected: false,
        mepStatus: ''
      },
      automationRevision: 0,
      migrateActivityZone: false
    };
    const basestation = new Basestation(client, deviceData);

    expect(() => {
      JSON.stringify(basestation)
    }).not.toThrow();
  });
});