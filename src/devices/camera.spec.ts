import { Camera } from './camera';
import { Client } from '../client';
import { ChildDeviceData, DeviceType } from '../responses';

describe('Camera Device', () => {

  const client = new Client();
  const deviceData: ChildDeviceData = {
    userId: 'USER-ID',
    deviceId: 'DEVICE-ID',
    uniqueId: 'UNIQUE-ID',
    deviceType: DeviceType.CAMERA,
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

  it('Should mirror ID correctly', () => {
    expect(camera.id).toBe('DEVICE-ID');
  });

  it('Should mirror unique ID correctly', () => {
    expect(camera.uniqueId).toBe('UNIQUE-ID');
  });

  it('Should mirror type correctly', () => {
    expect(camera.type).toBe(DeviceType.CAMERA);
  });

  it('Should mirror name correctly', () => {
    expect(camera.name).toBe('Camera');
  });

  it('Should mirror model ID correctly', () => {
    expect(camera.modelId).toBe('MODEL-ID');
  });

  it('Should mirror hardware version correctly', () => {
    expect(camera.hardwareVersion).toBe('v0.0.0');
  });
    
  it('Should convert to JSON', () => {
    expect(() => {
      JSON.stringify(camera)
    }).not.toThrow();
  });
});