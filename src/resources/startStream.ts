/**
 * Start stream.
 */
export interface StartStream {

  /**
   * From.
   */
  from: string;

  /**
   * To.
   */
  to: string;

  /**
   * Action.
   */
  action: Action;

  /**
   * Resources.
   */
  resource: string;

  /**
   * Publish?
   */
  publish: boolean;

  /**
   * Trans ID.
   */
  transId: string;

  /**
   * Properties.
   */
  properties: Properties;
}
  
/**
 * Properties.
 */
interface Properties {
  
  /**
   * Activity state.
   */
  activityState: ActivityState;
  
  /**
   * Camera ID.
   */
  cameraId: string;
}

/**
 * Action.
 */
export enum Action {

  /**
   * Get.
   */
  GET = 'get',
  
  /**
   * Set.
   */
  SET = 'set'
}
  
/**
 * Resources.
 */
export enum Resources {
  
  /**
   * Cameras.
   */
  CAMERAS = 'cameras',
  
  /**
   * Moddes.
   */
  MODES = 'modes',
    
  /**
   * Siren.
   */
  SIREN = 'siren',
  
  /**
   * Subsccriptions.
   */
  SUBSCRIPTIONS = 'subsriptions'
}
  
/**
 * Activity state.
 */
export enum ActivityState {
  
  /**
   * Start user stream.
   */
  START_USER_STEAM = 'startUserStream'
}