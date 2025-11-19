export interface Contract {
    id: string;
    userId: string;
    contractNumber: string;
    contractDate: string; // Storing as ISO string
    addendumNumber?: string;
    addendumDate?: string; // Storing as ISO string
    description: string;
    implementer: string;
    value: number;
    realization: number;
    remainingValue: number;
  }
  