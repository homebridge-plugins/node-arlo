import { Response } from "./response";
import { ErrorData } from "./errorData";

/**
 * Devices.
 */
export interface Devices extends Response {

  /**
   * Data.
   */
  data: (ParentData | ChildData)[] | ErrorData;
}

/**
 * Data.
 */
interface Data {

  /**
   * User ID.
   */
  userId: string;

  /**
   * Device ID.
   */
  deviceId: string;

  /**
   * Unique ID.
   */
  uniqueId: string;

  /**
   * Device type.
   */
  deviceType: DeviceType;

  /**
   * Device name.
   */
  deviceName: string;

  /**
   * Last modified.
   */
  lastModified: Date;

  /**
   * X cloud ID.
   */
  xCloudId: string;

  /**
   * Last image uploaded.
   */
  lastImageUploaded: string;

  /**
   * User role.
   */
  userRole: string;

  /**
   * Display order.
   */
  displayOrder: number;

  /**
   * Media object count.
   */
  mediaObjectCount: number;

  /**
   * State.
   */
  state: string;

  /**
   * Model ID.
   */
  modelId: string;

  /**
   * Cvr enabled?
   */
  cvrEnabled: boolean;

  /**
   * Date created.
   */
  dateCreated: Date;

  /**
   * Interface version.
   */
  interfaceVersion: string;

  /**
   * Interface schema version.
   */
  interfaceSchemaVer: string;

  /**
   * Owner.
   */
  owner: Owner;

  /**
   * Properties.
   */
  properties: Properties;
}

export interface ParentData extends Data {
  /**
   * Firmware version.
   */
  firmwareVersion: string;

  /**
   * Time zone.
   */
  timeZone: string;

  /**
   * Connectivity.
   */
  connectivity: Connectivity;

  /**
   * Automatic revision.
   */
  automationRevision: number;

  /**
   * Migrate activity zone?
   */
  migrateActivityZone: boolean;
}

export interface ChildData extends Data {

  /**
   * Parent ID.
   */
  parentId: string;

  /**
   * Presigned last image URL.
   */
  presignedLastImageUrl: string;

  /**
   * Presigned snapshot URL.
   */
  presignedSnapshotUrl: string;

  /**
   * Presignedd full frame snapshot URL.
   */
  presignedFullFrameSnapshotUrl: string;

  /**
   * Arlo mobile plan?
   */
  arloMobilePlan: boolean;
}

/**
 * Owner.
 */
interface Owner {

  /**
   * First name.
   */
  firstName: string;

  /**
   * Last name.
   */
  lastName: string;

  /**
   * Owner ID.
   */
  ownerId: string;
}

/**
 * Properties.
 */
interface Properties {

  /**
   * Model ID.
   */
  modelId: string;

  /**
   * Olson time zone.
   */
  olsonTimeZone: string;

  /**
   * Hardware version.
   */
  hwVersion: string;
}

/**
 * Connetivity.
 */
interface Connectivity {

  /**
   * Type.
   */
  type: string;

  /**
   * Connected?
   */
  connected: boolean;

  /**
   * Mep status.
   */
  mepStatus: string;
}

/**
 * Device types.
 */
export enum DeviceType {

  /**
   * Basestation.
   */
  BASESTATION = 'basestation',

  /**
   * Camera.
   */
  CAMERA = 'camera',

  /**
   * Siren.
   */
  SIREN = 'siren',

  /**
   * Q.
   */
  Q = 'arloq'
}