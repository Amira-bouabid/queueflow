import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateQueueDto {
  @IsString() @IsNotEmpty() name: string;
}

export class CreateTicketDto {
  @IsString() @IsNotEmpty() customerName: string;
}

export class UpdateStatusDto {
  @IsIn(['waiting', 'called', 'served', 'cancelled']) status: string;
}
