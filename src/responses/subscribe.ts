/**
 * Chunk.
 */
export interface Chunk {

  /**
   * Event.
   */
  event: string,
  
  /**
   * Data.
   */
  data: ChunkData;
}

/**
 * Chunk data.
 */
export interface ChunkData {

  /**
   * Status.
   */
  status?: string;

  /**
   * Trans ID.
   */
  transId?: string;

  /**
   * Resource.
   */
  resource?: string;

  /**
   * Action.
   */
  action?: string;

  /**
   * From.
   */
  from?: string;

  /**
   * Properties.
   */
  properties?: Properties & Properties[];

  /**
   * Error.
   */
  error?;
}

/**
 * Properties.
 */
export interface Properties {

  /**
   * Serial number.
   */
  serialNumber?: string;

  /**
   * Active mode.
   */
  activeMode?: string;

  /**
   * Activity state.
   */
  activityState?: string;

  /**
   * Audio detected.
   */
  audioDetected?;

  /**
   * Motion detected.
   */
  motionDetected?;

  /**
   * Battery level.
   */
  batteryLevel?;

  /**
   * Charging state.
   */
  chargingState?;
}