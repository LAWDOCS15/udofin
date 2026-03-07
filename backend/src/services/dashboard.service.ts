import Application from '../models/Application';
import User from '../models/User';
import NBFC from '../models/NBFC';
import { DashboardStats } from '../interfaces/dashboard.interface';

class DashboardService {
  public async getStats(): Promise<DashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = await Application.aggregate([
      {
        $facet: {
          "mainMetrics": [
            { $group: { 
                _id: null, 
                total: { $sum: 1 },
                approved: { $sum: { $cond: [{ $eq: ["$verificationStatus", "VERIFIED"] }, 1, 0] } },
                pending: { $sum: { $cond: [{ $eq: ["$verificationStatus", "PENDING"] }, 1, 0] } },
                // Disbursed amount logic fixed
                disbursed: { $sum: { $cond: [{ $eq: ["$verificationStatus", "DISBURSED"] }, 500000, 0] } } 
            }}
          ],
          "rejectedToday": [
            { $match: { verificationStatus: "REJECTED", updatedAt: { $gte: today } } },
            { $count: "count" }
          ],
          "trends": [
            { $match: { createdAt: { $gte: new Date(new Date().setMonth(today.getMonth() - 6)) } } },
            { $group: {
                _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                count: { $sum: 1 }
            }},
            { $sort: { "_id.year": 1, "_id.month": 1 } }
          ]
        }
      }
    ]);

    const totalUsers = await User.countDocuments({ role: 'BORROWER' });
    const uniquePhoneNumbers = await User.distinct("phoneNumber", { role: 'BORROWER', phoneNumber: { $exists: true, $ne: "" } });
    
    //  Active NBFC live count
    const activeNbfcCount = await NBFC.countDocuments({ isActive: true });
    //  New users today fix
    const newUsersCount = await User.countDocuments({ role: 'BORROWER', createdAt: { $gte: new Date(Date.now() - 24*60*60*1000) } });

    const m = stats[0].mainMetrics[0] || { total: 0, approved: 0, pending: 0, disbursed: 0 };

    return {
      totalApplications: m.total,
      totalDisbursed: m.disbursed,
      approvalRate: m.total > 0 ? ((m.approved / m.total) * 100).toFixed(2) : "0",
      activeNbfc: activeNbfcCount, 
      pendingReviews: m.pending,
      rejectedToday: stats[0].rejectedToday[0]?.count || 0,
      newUsersToday: newUsersCount,
      realUsers: uniquePhoneNumbers.length,
      duplicateUsers: totalUsers - uniquePhoneNumbers.length,
      trends: stats[0].trends
    };
  }
}
export default new DashboardService();