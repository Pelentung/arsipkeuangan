export interface Contract {
  id: string;
  title: string;
  parties: string[];
  startDate: string; // Storing as ISO string
  endDate:string;   // Storing as ISO string
  content: string;
  summary: string;
  createdAt: string; // Storing as ISO string
}
