import { PersonalAccessTokenCredentialHandler } from 'typed-rest-client/Handlers';

/**
 * Handler.
 */
export class Handler extends PersonalAccessTokenCredentialHandler {

  /**
   * Handler.
   * @param token Token.
   */
  constructor(token: string) {
    super(token);
  }
  
  /**
   * Prepare request.
   * @param options Options.
   */
  prepareRequest(options: any): void {
    options.headers['Authorization'] = this.token;
    options.headers['X-TFS-FedAuthRedirect'] = 'Suppress';
  }
}