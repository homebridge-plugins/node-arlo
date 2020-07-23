import { Response } from "./response";
import { ErrorData } from "./errorData";

/**
 * Devices.
 */
export interface StartStream extends Response {
  
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
   * URL.
   */
  url: string;
}