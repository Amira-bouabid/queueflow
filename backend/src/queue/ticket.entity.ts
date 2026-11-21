import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Queue } from './queue.entity';

export type TicketStatus = 'waiting' | 'called' | 'served' | 'cancelled';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerName: string;

  @Column()
  number: number; // numéro d'ordre dans la file

  @Column({ type: 'varchar', default: 'waiting' })
  status: TicketStatus;

  @ManyToOne(() => Queue, (q) => q.tickets, { onDelete: 'CASCADE' })
  queue: Queue;

  @CreateDateColumn()
  createdAt: Date;
}
