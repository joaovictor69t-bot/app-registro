
export interface DailyRecord {
  id: string;
  date: string;
  quantity: number;
  totalValue: number;
  photos: string[]; // Base64 strings
}

export enum AppTab {
  REGISTER = 'register',
  HISTORY = 'history',
  REPORTS = 'reports'
}

export interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  totalQuantity: number;
  totalValue: number;
  count: number;
}
