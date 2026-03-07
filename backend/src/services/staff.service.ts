import mongoose from 'mongoose';
import Staff, { IStaff } from '../models/Staff';

export const getAllStaffService = async (nbfcIdStr: string) => {
  const nbfcId = new mongoose.Types.ObjectId(nbfcIdStr);
  return await Staff.find({ nbfcId }).sort({ createdAt: -1 });
};

export const addStaffService = async (nbfcIdStr: string, staffData: Partial<IStaff>) => {
  const nbfcId = new mongoose.Types.ObjectId(nbfcIdStr);
  return await Staff.create({
    ...staffData,
    nbfcId
  });
};

export const deleteStaffService = async (staffId: string) => {
  return await Staff.findByIdAndDelete(staffId);
};