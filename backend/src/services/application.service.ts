// import mongoose from 'mongoose';
// import NBFC from '../models/NBFC';
// import Application from '../models/Application';

// // 1. Borrower submits application
// export const submitApplicationService = async (
//   userId: string,
//   userRole: string,
//   data: any,
//   files: any
// ) => {
//   if (userRole !== 'BORROWER') throw { status: 403, message: 'Access denied' };

//   const { nbfcId, aiChatData } = data;

//   if (!nbfcId || !mongoose.Types.ObjectId.isValid(nbfcId)) throw { status: 400, message: 'Invalid NBFC ID' };

//   const nbfcObjectId = new mongoose.Types.ObjectId(nbfcId);

//   const nbfcExists = await NBFC.findOne({ _id: nbfcObjectId, isActive: true }).lean();
//   if (!nbfcExists) throw { status: 400, message: 'Selected NBFC is not available' };

//   if (!files || !files.panCard?.[0] || !files.aadhaarCard?.[0] || !files.selfie?.[0]) {
//     throw { status: 400, message: 'All required documents must be uploaded.' };
//   }

//   let parsedChatData = {};
//   if (aiChatData) {
//     try {
//       parsedChatData = JSON.parse(aiChatData);
//     } catch {
//       throw { status: 400, message: 'Invalid AI chat data format.' };
//     }
//   }

//   const newApplication = await Application.create({
//     borrowerId: new mongoose.Types.ObjectId(userId),
//     nbfcId: nbfcObjectId,
//     aiChatData: parsedChatData,
//     documents: {
//       panCardUrl: files.panCard[0].path,
//       aadhaarCardUrl: files.aadhaarCard[0].path,
//       selfieUrl: files.selfie[0].path,
//     },
//     verificationStatus: 'PENDING',
//   });

//   return { applicationId: newApplication._id };
// };

// // 2. NBFC Admin fetches ONLY their assigned applications
// export const getNbfcLeadsService = async (userId: string, userRole: string, nbfcId: string | null | undefined) => {
//   if (userRole !== 'NBFC_ADMIN') throw { status: 403, message: 'Access denied' };
//   if (!nbfcId) throw { status: 403, message: 'You are not assigned to any NBFC.' };
//   if (!mongoose.Types.ObjectId.isValid(nbfcId)) throw { status: 400, message: 'Invalid NBFC ID.' };

//   const nbfcObjectId = new mongoose.Types.ObjectId(nbfcId);

//   const applications = await Application.find({ nbfcId: nbfcObjectId })
//     .populate('borrowerId', 'name email phone')
//     .sort({ createdAt: -1 })
//     .lean();

//   return { count: applications.length, applications };
// };

// // 3. Fetch all active NBFCs
// export const getActiveNbfcsService = async () => {
//   const nbfcs = await NBFC.find({ isActive: true }).select('_id name').lean();
//   return { nbfcs };
// };

// // 4. NBFC Admin updates status
// export const updateVerificationStatusService = async (
//   userId: string,
//   userRole: string,
//   adminNbfcId: string | null | undefined,
//   applicationId: string,
//   data: any
// ) => {
//   if (userRole !== 'NBFC_ADMIN') throw { status: 403, message: 'Access denied. NBFC_ADMIN role required.' };

//   const { verificationStatus, rejectionReason } = data;

//   const allowedStatuses = ['VERIFIED', 'REJECTED', 'DISBURSED'];
//   if (!allowedStatuses.includes(verificationStatus)) {
//     throw { status: 400, message: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` };
//   }

//   if (!applicationId || !mongoose.Types.ObjectId.isValid(applicationId)) {
//     throw { status: 400, message: 'Invalid application ID.' };
//   }

//   if (!adminNbfcId) throw { status: 403, message: 'You are not assigned to any NBFC.' };

//   const application = await Application.findOne({
//     _id: applicationId,
//     nbfcId: new mongoose.Types.ObjectId(adminNbfcId),
//   });

//   if (!application) {
//     throw { status: 404, message: 'Application not found or does not belong to your NBFC.' };
//   }

//   if (application.verificationStatus === 'DISBURSED') {
//     throw { status: 400, message: 'Cannot update a disbursed application.' };
//   }

//   if (verificationStatus === 'DISBURSED' && application.verificationStatus !== 'VERIFIED') {
//     throw { status: 400, message: 'Application must be VERIFIED before marking as DISBURSED.' };
//   }

//   application.verificationStatus = verificationStatus;

//   if (verificationStatus === 'REJECTED' && rejectionReason) {
//     application.rejectionReason = rejectionReason;
//   }

//   await application.save();

//   return {
//     applicationId: application._id,
//     verificationStatus: application.verificationStatus,
//   };
// };

// // 5. Borrower fetches their own applications
// export const getMyApplicationsService = async (userId: string) => {
//   const borrowerId = new mongoose.Types.ObjectId(userId);

//   const applications = await Application.find({ borrowerId })
//     .populate('nbfcId', 'name')
//     .sort({ createdAt: -1 })
//     .lean();

//   const formattedLoans = applications.map((app: any) => ({
//     id: app._id,
//     nbfcName: app.nbfcId?.name || 'Assigned NBFC',
//     amount: app.aiChatData?.requestedAmount || 0,
//     cibilScore: app.aiChatData?.score || 0,
//     status: app.verificationStatus,
//     appliedAt: app.createdAt
//   }));

//   return { loans: formattedLoans };
// };


// src/services/application.service.ts


import mongoose from 'mongoose';
import NBFC from '../models/NBFC';
import Application from '../models/Application';

// 1. Borrower submits application
export const submitApplicationService = async (userId: string, userRole: string, data: any, files: any) => {
  if (userRole !== 'BORROWER') throw { status: 403, message: 'Access denied' };
  const { nbfcId, aiChatData } = data;

  if (!nbfcId || !mongoose.Types.ObjectId.isValid(nbfcId)) throw { status: 400, message: 'Invalid NBFC ID' };
  const nbfcObjectId = new mongoose.Types.ObjectId(nbfcId);

  const nbfcExists = await NBFC.findOne({ _id: nbfcObjectId, isActive: true }).lean();
  if (!nbfcExists) throw { status: 400, message: 'Selected NBFC is not available' };

  if (!files || !files.panCard?.[0] || !files.aadhaarCard?.[0] || !files.selfie?.[0]) {
    throw { status: 400, message: 'All required documents must be uploaded.' };
  }

  let parsedChatData = {};
  if (aiChatData) {
    try { parsedChatData = JSON.parse(aiChatData); } 
    catch { throw { status: 400, message: 'Invalid AI chat data format.' }; }
  }

  const newApplication = await Application.create({
    borrowerId: new mongoose.Types.ObjectId(userId),
    nbfcId: nbfcObjectId,
    aiChatData: parsedChatData,
    documents: {
      // panCardUrl: files.panCard[0].path,
      // aadhaarCardUrl: files.aadhaarCard[0].path,
      // selfieUrl: files.selfie[0].path,
      panCardUrl: files.panCard[0].path.replace(/\\/g, "/"),
      aadhaarCardUrl: files.aadhaarCard[0].path.replace(/\\/g, "/"),
      selfieUrl: files.selfie[0].path.replace(/\\/g, "/"),
    },
    verificationStatus: 'PENDING',
  });

  return { applicationId: newApplication._id };
};

// 2. NBFC Admin fetches ONLY their assigned applications
export const getNbfcLeadsService = async (userId: string, userRole: string, nbfcId: string | null | undefined) => {
  if (userRole !== 'NBFC_ADMIN') throw { status: 403, message: 'Access denied' };
  if (!nbfcId) throw { status: 403, message: 'You are not assigned to any NBFC.' };
  
  const nbfcObjectId = new mongoose.Types.ObjectId(nbfcId);
  const applications = await Application.find({ nbfcId: nbfcObjectId })
    .populate('borrowerId', 'name email phone')
    .sort({ createdAt: -1 })
    .lean();

  return { count: applications.length, applications };
};

// 🚩 ADDED: Missing function jo error de raha tha
export const getActiveNbfcsService = async () => {
  const nbfcs = await NBFC.find({ isActive: true }).select('_id name').lean();
  return { nbfcs };
};

// 4. NBFC Admin updates status
export const updateVerificationStatusService = async (userId: string, userRole: string, adminNbfcId: string | null | undefined, applicationId: string, data: any) => {
  if (userRole !== 'NBFC_ADMIN') throw { status: 403, message: 'NBFC_ADMIN role required.' };

  const { verificationStatus, rejectionReason } = data;
  const allowedStatuses = ['VERIFIED', 'REJECTED', 'DISBURSED'];

if (!verificationStatus || !allowedStatuses.includes(verificationStatus)) {
    throw { status: 400, message: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` };
  }
  
  // if (!allowedStatuses.includes(verificationStatus)) {
  //   throw { status: 400, message: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` };
  // }

  if (!applicationId || !mongoose.Types.ObjectId.isValid(applicationId)) {
    throw { status: 400, message: 'Invalid application ID.' };
  }

  if (!adminNbfcId) throw { status: 403, message: 'You are not assigned to any NBFC.' };
  if (!allowedStatuses.includes(verificationStatus)) throw { status: 400, message: 'Invalid status' };

  const application = await Application.findOne({
    _id: new mongoose.Types.ObjectId(applicationId),
    nbfcId: new mongoose.Types.ObjectId(adminNbfcId!),
  });

  if (!application) throw { status: 404, message: 'Application not found' };

  application.verificationStatus = verificationStatus;
  if (verificationStatus === 'REJECTED' && rejectionReason) {
    application.rejectionReason = rejectionReason;
  }

  await application.save();
  return { applicationId: application._id, verificationStatus: application.verificationStatus };
};

// 5. Borrower fetches their own applications
export const getMyApplicationsService = async (userId: string) => {
  const applications = await Application.find({ borrowerId: new mongoose.Types.ObjectId(userId) })
    .populate('nbfcId', 'name')
    .sort({ createdAt: -1 })
    .lean();

  return {
    loans: applications.map((app: any) => ({
      id: app._id,
      nbfcName: app.nbfcId?.name || 'Assigned NBFC',
      amount: app.aiChatData?.requestedAmount || 0,
      status: app.verificationStatus,
      appliedAt: app.createdAt
    }))
  };
};


