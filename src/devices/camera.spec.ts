import { Camera } from './camera';
import { Client } from '../client';
import { ChildDeviceData, DeviceTypes } from '../responses';

describe(Camera, () => {
    
  it('Should convert to JSON', () => {
    const client = new Client();
    const deviceData: ChildDeviceData = {
      userId: 'USER-ID',
      deviceId: 'DEVICE-ID',
      uniqueId: 'UNIQUE-ID',
      deviceType: DeviceTypes.CAMERA,
      deviceName: 'Camera',
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
      parentId: 'PARENT-ID',
      presignedLastImageUrl: 'https://localhost/presigned-last-image',
      presignedSnapshotUrl: 'https://localhost/presigned-snapshot',
      presignedFullFrameSnapshotUrl: 'https://localhost/presigned-full-frame-snapshot',
      arloMobilePlan: false
    };
    const camera = new Camera(client, deviceData);

    expect(() => {
      JSON.stringify(camera)
    }).not.toThrow();
  });
});