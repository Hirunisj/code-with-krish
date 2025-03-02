import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entity/order-item-entity';
import { Order } from './entity/order.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), HttpModule],
  providers: [OrdersService],
  controllers: [OrdersController]
})
export class OrdersModule {}
