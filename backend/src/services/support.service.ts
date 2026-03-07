// services/support.service.ts
import Ticket, { ITicket } from '../models/Ticket';

class SupportService {
  public async getAllTickets(filter: object = {}): Promise<ITicket[]> {
    return await Ticket.find(filter).sort({ updatedAt: -1 }).lean();
  }

  public async addMessage(ticketId: string, sender: 'admin' | 'user', message: string): Promise<ITicket | null> {
    return await Ticket.findByIdAndUpdate(
      ticketId,
      { $push: { messages: { sender, message, createdAt: new Date() } } },
      { new: true }
    );
  }
}

export default new SupportService();