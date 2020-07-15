/**
 * URL.
 */
const url = 'https://arlo.netgear.com/hmsweb';

/**
 * Client URL.
 */
const clientUrl = `${url}/client`;

/**
 * Devices URL.
 */
const devicesUrl = `${url}/users/devices`;

/**
 * Devices URL.
 */
export const DEVICES = devicesUrl;

/**
 * Login URL..
 */
export const LOGIN = `${url}/login`;

/**
 * Notify URL.
 */
export const NOTIFY = `${devicesUrl}/notify`;

/**
 * Full frame snapshot URL.
 */
export const SNAPSHOT = `${devicesUrl}/fullFrameSnapshot`;

/**
 * Subscribe URL.
 */
export const SUBSCRIBE = `${clientUrl}/subscribe`;

/**
 * Start stream URL.
 */
export const STREAM = `${devicesUrl}/startStream`;