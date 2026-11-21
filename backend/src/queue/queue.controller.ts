import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { QueueService } from './queue.service';
import { CreateQueueDto, CreateTicketDto, UpdateStatusDto } from './queue.dto';
import { TicketStatus } from './ticket.entity';

@Controller()
export class QueueController {
  constructor(private service: QueueService) {}

  @Get('queues') listQueues() { return this.service.listQueues(); }

  @Post('queues') createQueue(@Body() dto: CreateQueueDto) {
    return this.service.createQueue(dto.name);
  }

  @Get('queues/:id/tickets')
  listTickets(@Param('id', ParseIntPipe) id: number) { return this.service.listTickets(id); }

  @Post('queues/:id/tickets')
  createTicket(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateTicketDto) {
    return this.service.createTicket(id, dto.customerName);
  }

  @Post('queues/:id/call-next')
  callNext(@Param('id', ParseIntPipe) id: number) { return this.service.callNext(id); }

  @Patch('tickets/:id/status')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStatusDto) {
    return this.service.updateStatus(id, dto.status as TicketStatus);
  }
}
