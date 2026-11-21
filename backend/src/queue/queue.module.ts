import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Queue } from './queue.entity';
import { Ticket } from './ticket.entity';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';
import { QueueGateway } from './queue.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Queue, Ticket])],
  controllers: [QueueController],
  providers: [QueueService, QueueGateway],
})
export class QueueModule {}
