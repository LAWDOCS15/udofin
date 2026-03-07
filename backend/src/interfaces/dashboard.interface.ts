export interface MonthlyTrend {
  _id: { month: number; year: number };
  count: number;
}

export interface DashboardStats {
  totalApplications: number;
  totalDisbursed: number;
  approvalRate: string;
  activeNbfc: number;
  pendingReviews: number;
  rejectedToday: number;
  newUsersToday: number;
  realUsers: number;
  duplicateUsers: number;
  trends: MonthlyTrend[];
}