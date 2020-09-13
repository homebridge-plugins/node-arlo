import { ErrorData } from "./errorData";

/**
 * Login.
 */
export interface Login {

  /**
   * Success?
   */
  success: boolean;

  /**
   * Data.
   */
  data: Data | ErrorData;
}

/**
 * Data.
 */
export interface Data {

  /**
   * User ID.
   */
  userId: number;

  /**
   * Email.
   */
  email: string;

  /**
   * Token.
   */
  token: string;

  /**
   * Authenticated.
   */
  authenticated: Date;

  /**
   * Account status.
   */
  accountStatus: string;

  /**
   * Country code.
   */
  countryCode: string;

  /**
   * To update?
   */
  tocUpdate: boolean;

  /**
   * Policy update?
   */
  policyUpdate: boolean;

  /**
   * App store.
   */
  appStore: AppStore;

  /**
   * Valid email
   */
  validEmail: boolean;

  /**
   * Arlo?
   */
  arlo: boolean;

  /**
   * Date created.
   */
  dateCreated: Date;

  /**
   * Mail program checked?
   */
  mailProgramChecked: boolean;

  /**
   * Error.
   */
  error: string;

  /**
   * Message.
   */
  message: string;

  /**
   * Reason.
   */
  reason: string;
}

/**
 * App store.
 */
interface AppStore {

  /**
   * Update link.
   */
  updateLink: string;

  /**
   * Enforce?
   */
  enforce: boolean;

  /**
   * Latest version.
   */
  latestVersion: string;

  /**
   * Enforce date.
   */
  enforceDate: Date;
}