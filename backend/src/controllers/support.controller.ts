import { Request, Response } from 'express';
import SupportService from '../services/support.service';

export const getTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await SupportService.getAllTickets();
    res.json({ success: true, tickets });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const replyToTicket = async (req: Request, res: Response) => {
  const { ticketId, message } = req.body;
  try {
    // Controller calls the service instead of DB directly
    const ticket = await SupportService.addMessage(ticketId, 'admin', message);
    res.json({ success: true, ticket });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};