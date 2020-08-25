/**
 * Full frame snapshot.
 */
export interface FullFrameSnapshot {

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
   * Acctive?
   */
  activityState: ActivityState;
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
   * Full frame snapshot.
   */
  FULL_FRAME_SNAPSHOT = 'fullFrameSnapshot'
}