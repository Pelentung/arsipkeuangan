// NOTE: This is a dev-only error class. It is not intended for production use.
// It is used to surface rich, contextual errors to the Next.js development overlay.

export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  /**
   * The context of the security rule that failed.
   * This is serialized and passed to the client.
   */
  public securityRuleContext: SecurityRuleContext;
  public readonly name = 'FirestorePermissionError';
  public readonly isDevOnly = true;

  constructor(context: SecurityRuleContext) {
    const { path, operation } = context;
    const message = `
FirestoreError: Missing or insufficient permissions:
The following request was denied by Firestore Security Rules:
  - operation: ${operation}
  - path: ${path}
    `;
    super(message);
    this.securityRuleContext = context;

    // This is a dev-only feature.
    if (process.env.NODE_ENV !== 'development') {
      // In production, we don't want to leak any sensitive information.
      this.message = 'Missing or insufficient permissions.';
    }
  }
}
