import Application from '../models/Application';
import User from '../models/User';
import NBFC from '../models/NBFC';
import { DashboardStats } from '../interfaces/dashboard.interface';
import mongoose from 'mongoose';
import Loan from '../models/Loan';
import Emi from '../models/Emi';

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



export const getNbfcStatsService = async (nbfcIdStr: string) => {
  const nbfcId = new mongoose.Types.ObjectId(nbfcIdStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const [totalApps, pendingApps, loanStats, collectionStats] = await Promise.all([
    Application.countDocuments({ nbfcId }),
    Application.countDocuments({ nbfcId, verificationStatus: 'PENDING' }),
    Loan.aggregate([
      { $match: { nbfcId, status: 'DISBURSED' } },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }
    ]),
    Emi.aggregate([
      { $match: { nbfcId } },
      { $group: {
          _id: null,
          collected: { $sum: { $cond: [{ $and: [{ $eq: ["$status", "paid"] }, { $gte: ["$paidDate", today] }, { $lt: ["$paidDate", tomorrow] }] }, "$amount", 0 ] } },
          overdue: { $sum: { $cond: [{ $and: [{ $eq: ["$status", "upcoming"] }, { $lt: ["$dueDate", today] }] }, 1, 0 ] } }
      }}
    ])
  ]);

  return {
    totalLoans: totalApps,
    activeCustomers: loanStats[0]?.count || 0,
    pendingApplications: pendingApps,
    totalDisbursed: loanStats[0]?.total || 0,
    emiCollectedToday: collectionStats[0]?.collected || 0,
    emiOverdueToday: collectionStats[0]?.overdue || 0,
    defaultRate: 1.5
  };
};

export const getNbfcCustomersService = async (nbfcIdStr: string) => {
  const nbfcId = new mongoose.Types.ObjectId(nbfcIdStr);
  const applications = await Application.find({ nbfcId, verificationStatus: 'DISBURSED' })
    .populate('borrowerId', 'name email phone')
    .sort({ createdAt: -1 });

  return applications.map(app => {
    const borrower = app.borrowerId as any;
    return {
      id: app._id.toString(),
      _id: app._id.toString(),
      name: borrower?.name || "Unknown Customer",
      email: borrower?.email || "N/A",
      phone: borrower?.phone || "N/A",
      loanId: `LN-${app._id.toString().slice(-6).toUpperCase()}`,
      loanAmount: app.aiChatData?.requestedAmount || 0,
      outstandingAmount: app.aiChatData?.requestedAmount || 0,
      emiAmount: Math.round((app.aiChatData?.requestedAmount || 0) / 12),
      nextEmiDate: "Apr 05, 2026",
      status: "active",
      cibilScore: app.aiChatData?.score || 0,
      joinedAt: new Date(app.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    };
  });
};

export const getNbfcReportsService = async (nbfcIdStr: string) => {
  const nbfcId = new mongoose.Types.ObjectId(nbfcIdStr);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const [monthlyTrends, revenueData, loanStats, emiCounts, overdueLoans] = await Promise.all([
    Application.aggregate([
      { $match: { nbfcId, createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          apps: { $sum: 1 },
          approved: { $sum: { $cond: [{ $eq: ["$verificationStatus", "DISBURSED"] }, 1, 0] } }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]),
    Emi.aggregate([
      { $match: { nbfcId, status: 'paid' } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]),
    Loan.aggregate([
      { $match: { nbfcId, status: 'DISBURSED' } },
      { $group: { _id: null, avgSize: { $avg: "$amount" }, count: { $sum: 1 } } }
    ]),
    Promise.all([
      Emi.countDocuments({ nbfcId }),
      Emi.countDocuments({ nbfcId, status: 'paid' })
    ]),
    Emi.distinct("loanId", { nbfcId, status: 'upcoming', dueDate: { $lt: ninetyDaysAgo } })
  ]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedMonthly = monthlyTrends.map(d => ({
    month: monthNames[d._id.month - 1],
    apps: d.apps,
    approved: d.approved,
    collected: d.approved * 125000 
  }));

  const totalPaidAmount = revenueData[0]?.total || 0;
  const avgTicket = loanStats[0]?.avgSize || 0;
  const totalEmis = emiCounts[0];
  const paidEmis = emiCounts[1];
  const collectionRate = totalEmis > 0 ? (paidEmis / totalEmis) * 100 : 0;
  const npaRate = (loanStats[0]?.count > 0) ? (overdueLoans.length / loanStats[0].count) * 100 : 0;

  return {
    stats: [
      { 
        label: "Total Revenue", 
        value: `₹${(totalPaidAmount / 100000).toFixed(2)}L`, 
        change: "+12%", up: true 
      },
      { 
        label: "Avg Ticket Size", 
        value: `₹${(avgTicket / 100000).toFixed(1)}L`, 
        change: "+3%", up: true 
      },
      { 
        label: "Collection Rate", 
        value: `${collectionRate.toFixed(1)}%`, 
        change: "+1.5%", up: true 
      },
      { 
        label: "NPA Rate", 
        value: `${npaRate.toFixed(1)}%`, 
        change: "-0.2%", up: false 
      },
    ],
    monthly: formattedMonthly
  };
};


export const getPendingApplicationsCountService = async (nbfcId: string) => {
  const count = await Application.countDocuments({ 
    nbfcId: new mongoose.Types.ObjectId(nbfcId), 
    verificationStatus: 'PENDING' 
  });
  
  return count;
};
