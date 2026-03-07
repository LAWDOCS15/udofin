import AuditLog from '../models/AuditLog';

class AuditService {
  async fetchLogs(nbfcId?: string) {
    const query = nbfcId ? { nbfcId } : {};
    return await AuditLog.find(query)
      .populate('adminId', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);
  }
}
export default new AuditService();