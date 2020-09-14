/**
 * Notify.
 */
export interface Notify {

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
  resource: Resources | string;

  /**
   * Publish?
   */
  publish: boolean;

  /**
   * Properties.
   */
  properties?: ModeProperties | SirenProperties | SubscribeProperties | Record<string, unknown>;
}

/**
 * Mode properties.
 */
interface ModeProperties {

  /**
   * Acctive?
   */
  active: string | Modes;
}

/**
 * Siren properties.
 */
interface SirenProperties {

  /**
   * Siren state.
   */
  sirenState: SirenStates;

  /**
   * Duration.
   */
  duration: number;

  /**
   * Volume.
   */
  volume: number;

  /**
   * Pattern.
   */
  pattern: Pattern;
}

/**
 * Subscribe properties.
 */
interface SubscribeProperties {

  /**
   * Devices.
   */
  devices: string[];
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
   * Subscriptions.
   */
  SUBSCRIPTIONS = 'subscriptions'
}

/**
 * Modes.
 */
export enum Modes {

  /**
   * Armed.
   */
  ARMED = 'mode1',

  /**
   * Disarmed.
   */
  DISARMED = 'mode2'
}

/**
 * Siren states.
 */
export enum SirenStates {

  /**
   * On.
   */
  ON = 'on',

  /**
   * Off.
   */
  OFF = 'off'
}

/**
 * Pattern.
 */
export enum Pattern {
  ALARM = 'alarm'
}