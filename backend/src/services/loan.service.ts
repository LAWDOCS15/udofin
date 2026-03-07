import mongoose from 'mongoose';
import Loan from '../models/Loan';
import Emi from '../models/Emi';
import Application from '../models/Application';

export const getLoanById = async (loanId: string) => {
  const loan = await Loan.findById(loanId)
    .populate('borrowerId', 'name email phone')
    .populate('applicationId');
    
  if (!loan) {
    throw { status: 404, message: 'Loan record not found' };
  }
  return loan;
};

export const processDisbursement = async (applicationId: string, nbfcId: string) => {
  const app = await Application.findById(applicationId);
  if (!app) throw { status: 404, message: "Application not found" };

  const amount = app.aiChatData?.requestedAmount || 0;
  if (amount <= 0) throw { status: 400, message: "Invalid loan amount" };

  const newLoan = await Loan.create({
    borrowerId: app.borrowerId,
    nbfcId: new mongoose.Types.ObjectId(nbfcId),
    applicationId: app._id as any,
    amount: amount,
    interestRate: 12,
    tenure: 12,
    status: 'DISBURSED'
  });

  const principal = amount;
  const rate = 12 / 12 / 100; 
  const months = 12;
  const emiAmount = Math.round(
    (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
  );

  const emis: any[] = []; 
  for (let i = 1; i <= months; i++) {
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + i);
    
    emis.push({
      loanId: (newLoan as any)._id,
      nbfcId: new mongoose.Types.ObjectId(nbfcId),
      borrowerId: app.borrowerId,
      applicationId: app._id as any,
      emiNumber: i,
      amount: emiAmount,
      dueDate: dueDate,
      status: 'upcoming'
    });
  }

  await Emi.insertMany(emis);
  
  app.verificationStatus = 'DISBURSED' as any;
  await app.save();

  return newLoan;
};


export const getDisbursementsByNbfc = async (nbfcId: string) => {
  return await Loan.find({ nbfcId: new mongoose.Types.ObjectId(nbfcId) })
    .populate('borrowerId', 'name phone') 
    .populate('applicationId', 'aiChatData') 
    .sort({ createdAt: -1 }); 
};