export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  requestResourceData?: any;
};

const FIRESTORE_PERMISSION_ERROR_NAME = 'FirestorePermissionError';

export class FirestorePermissionError extends Error {
  public readonly name = FIRESTORE_PERMISSION_ERROR_NAME;
  public readonly context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    const message = `
Firestore Security Rules Permission Denied.
The following request was denied:
${JSON.stringify(context, null, 2)}
    `;
    super(message);
    this.context = context;
  }
}
