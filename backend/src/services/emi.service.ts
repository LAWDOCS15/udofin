
  import Emi from '../models/Emi';

export const getEmisByNbfc = async (nbfcId: string, status?: string) => {
    const query: any = { nbfcId };
    if (status) query.status = status;

    return await Emi.find(query)
      .populate('borrowerId', 'name email phone')
      .sort({ dueDate: 1 });
};

export const updateEmiStatus = async (emiId: string, status: string, paymentData: any) => {
    return await Emi.findByIdAndUpdate(
      emiId,
      { 
        status, 
        paidDate: status === 'paid' ? new Date() : null,
        paymentDetails: paymentData 
      },
      { new: true }
    );
};

export const getTrackerEmisService = async (nbfcId: string) => {
  const emis = await Emi.find({ nbfcId })
    .populate('borrowerId', 'name')
    .sort({ dueDate: 1 });

  return emis.map(emi => ({
    id: emi._id.toString(),
    customerName: (emi.borrowerId as any)?.name || "Unknown",
    loanId: `LN-${emi._id.toString().slice(-6).toUpperCase()}`,
    emiNumber: emi.emiNumber,
    totalEmis: 12, 
    amount: emi.amount,
    dueDate: new Date(emi.dueDate).toISOString().split('T')[0],
    status: emi.status,
    paidDate: emi.paidDate ? new Date(emi.paidDate).toISOString().split('T')[0] : null
  }));
};