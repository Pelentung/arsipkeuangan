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

export interface Bill {
  id: string;
  spmNumber: string;
  spmDate: string; // Storing as ISO string
  sp2dNumber: string;
  sp2dDate: string; // Storing as ISO string
  description: string;
  amount: number;
  status: 'Uang Muka (DP)' | 'Termin' | 'Termin Terakhir';
}
  