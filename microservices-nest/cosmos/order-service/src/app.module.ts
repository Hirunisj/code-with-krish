import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entity/order.entity';
import { OrderItem } from './orders/entity/order-item-entity';

@Module({
  imports: [
    OrdersModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host:process.env.HOSTNAME || 'localhost',
      port: 3306,
      username:  'root',
      password: '',
      database: 'cosmos',
      entities: [Order, OrderItem],
      synchronize: true

    }),

  ]
 

})
export class AppModule {}
