import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as loanService from '../services/loan.service';

export const disburseLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { applicationId } = req.body;
    const nbfcId = req.user?.nbfcId;

    const result = await loanService.processDisbursement(applicationId, nbfcId as string);
    
    res.status(200).json({
      message: 'Loan disbursed and EMI schedule created successfully',
      loan: result
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Disbursement error' });
  }
};

export const getLoanDetails = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const loan = await loanService.getLoanById(req.params.id as string);
    res.status(200).json(loan);
  } catch (error: any) {
    res.status(404).json({ message: 'Loan not found' });
  }
};

export const getDisbursementList = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const nbfcId = req.user?.nbfcId;
    
    if (!nbfcId) {
      res.status(400).json({ message: "NBFC ID not found in token" });
      return;
    }

    const disbursements = await loanService.getDisbursementsByNbfc(nbfcId as string);

    const formattedData = disbursements.map((d: any) => ({
      id: d._id.toString().slice(-6).toUpperCase(),
      loanId: d.applicationId?._id ? d.applicationId._id.toString().slice(-6).toUpperCase() : "N/A",
      customerName: d.borrowerId?.name || "Unknown",
      amount: d.amount,
      status: d.status.toLowerCase(),
      method: "NEFT", 
      accountNumber: d.borrowerId?.phone ? `XXXX${d.borrowerId.phone.slice(-4)}` : "XXXX0000",
      disbursedAt: d.createdAt ? d.createdAt.toISOString().split('T')[0] : "N/A",
      reference: `UTR${Math.random().toString(36).toUpperCase().slice(2, 10)}`
    }));

    res.status(200).json({ success: true, data: formattedData });
  } catch (error: any) {
    console.error("Error in getDisbursementList:", error);
    res.status(500).json({ message: error.message || 'Error fetching disbursements' });
  }
};