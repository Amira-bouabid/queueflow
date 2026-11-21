import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueModule } from './queue/queue.module';
import { Queue } from './queue/queue.entity';
import { Ticket } from './queue/ticket.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +(process.env.DB_PORT || 5433),
      username: process.env.DB_USER || 'queueflow',
      password: process.env.DB_PASSWORD || 'queueflow',
      database: process.env.DB_NAME || 'queueflow',
      entities: [Queue, Ticket],
      synchronize: true, // dev uniquement : crée les tables automatiquement
    }),
    QueueModule,
  ],
})
export class AppModule {}
