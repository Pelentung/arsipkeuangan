export interface Contract {
    id: string;
    userId: string;
    documentName: string;
    partiesInvolved: string[];
    effectiveDate: string; // Storing as ISO string
    expirationDate:string;   // Storing as ISO string
    terms: string;
    documentUrl: string;
    summary: string;
  }
  