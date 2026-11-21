import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Queue } from './queue.entity';
import { Ticket, TicketStatus } from './ticket.entity';
import { QueueGateway } from './queue.gateway';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(Queue) private queues: Repository<Queue>,
    @InjectRepository(Ticket) private tickets: Repository<Ticket>,
    private gateway: QueueGateway,
  ) {}

  listQueues() {
    return this.queues.find({ order: { id: 'ASC' } });
  }

  createQueue(name: string) {
    return this.queues.save(this.queues.create({ name }));
  }

  listTickets(queueId: number) {
    return this.tickets.find({
      where: { queue: { id: queueId } },
      order: { number: 'ASC' },
    });
  }

  private async push(queueId: number) {
    this.gateway.broadcast(queueId, await this.listTickets(queueId));
  }

  async createTicket(queueId: number, customerName: string) {
    const queue = await this.queues.findOneBy({ id: queueId });
    if (!queue) throw new NotFoundException('File introuvable');
    const last = await this.tickets.findOne({
      where: { queue: { id: queueId } },
      order: { number: 'DESC' },
    });
    const ticket = await this.tickets.save(
      this.tickets.create({ customerName, queue, number: (last?.number ?? 0) + 1 }),
    );
    await this.push(queueId);
    return ticket;
  }

  async updateStatus(ticketId: number, status: TicketStatus) {
    const ticket = await this.tickets.findOne({ where: { id: ticketId }, relations: ['queue'] });
    if (!ticket) throw new NotFoundException('Ticket introuvable');
    ticket.status = status;
    await this.tickets.save(ticket);
    await this.push(ticket.queue.id);
    return ticket;
  }

  // Appelle le prochain client en attente
  async callNext(queueId: number) {
    const next = await this.tickets.findOne({
      where: { queue: { id: queueId }, status: 'waiting' },
      order: { number: 'ASC' },
      relations: ['queue'],
    });
    if (!next) return null;
    return this.updateStatus(next.id, 'called');
  }
}
