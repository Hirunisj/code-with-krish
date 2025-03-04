import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entity/order-item.entity';
import { createOrderDto } from './dto/create-order.dto';
import { OrderStatus, UpdateOrderStatus } from './dto/update-order.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Kafka } from 'kafkajs';
import {Redis} from 'ioredis'

@Injectable()
export class OrdersService {
  private kafka = new Kafka({brokers: ['localhost:9092']});
  private readonly redis = new Redis({host:'localhost', port:6379});
  private readonly producer = this.kafka.producer();
  private readonly consumer = this.kafka.consumer({groupId: 'hiruni-order-service'});
  private readonly inventoryServiceUrl = 'http://localhost:3001/products';
  private readonly customerServiceUrl = 'http://localhost:3002/customers';

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly httpService: HttpService,
  ) {}

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
    await this.consumedConfirmedOrder();
  }

 async create(createOrderDto: createOrderDto): Promise<any> {
    const { customerId, items } = createOrderDto;
    //--------customer
    // Validate customer exists
    let customerName = '';
    try {
      const response$ = this.httpService.get(
        `${this.customerServiceUrl}/${customerId}`,
      );
      const response = await lastValueFrom(response$);
      customerName = response.data.name;
    } catch (error) {
      throw new BadRequestException(
        `Customer ID ${customerId} does not exist.`,
      );
    }

    //aqure lock
    for (const item of items){
      const lockKey = `hiruni.product:${item.productId}:`
      const lock = await this.redis.set(lockKey, new Date().getTime(), 'EX' , 36000*24, 'NX');
      if (!lock){
        throw new BadRequestException(`product id ${item.productId} is beign processed, please try again later`)
      }
      

    }

    //produce order as an event

    this.producer.send({
      topic: 'hiruni.order.create', 
      messages: [{ value: JSON.stringify({ customerId, items }) }],
    });
    return { message: 'Order is placed. Waiting inventory service to process' };

    //-----------------

    //---------
  //   for (const item of items) {
  //     try {
  //       const response$ = this.httpService.get(
  //         `${this.inventoryServiceUrl}/${item.productId}/validate?quantity=${item.quantity}`,
  //       );
  //       const response = await lastValueFrom(response$);
  //       if (!response.data.available) {
  //         throw new BadRequestException(
  //           `Product ID ${item.productId} is out of stock.`,
  //         );
  //       }
  //     } catch (error) {
  //       throw new BadRequestException(
  //         `Error checking stock for Product ID ${item.productId}: ${error.message}`,
  //       );
  //     }
  //   }
  //   //---------

  //   const order = this.orderRepository.create({
  //     customerId,
  //     status: 'PENDING',
  //   });
  //   const savedOrder = await this.orderRepository.save(order);

  //   const orderItems = items.map((item) =>
  //     this.orderItemRepository.create({
  //       productId: item.productId,
  //       price: item.price,
  //       quantity: item.quantity,
  //       order: savedOrder,
  //     }),
  //   );
  //   const savedOrderItems = await this.orderItemRepository.save(orderItems);

  //   // Reduce stock in Inventory Service
  //   for (const item of savedOrderItems) {
  //     try {
  //       await lastValueFrom(
  //         this.httpService.patch(
  //           `${this.inventoryServiceUrl}/${item.productId}/quantity`,
  //           { quantity: item.quantity },
  //         ),
  //       );
  //     } catch (error) {
  //       throw new BadRequestException(
  //         `Failed to reduce stock for Product ID ${item.productId}`,
  //       );
  //     }
  //   }
  //   return { ...savedOrder, customerName, items: orderItems };
  }
  async fetch(id: any) {
    return await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });
  }
  async fetchAll() {
    return await this.orderRepository.find({ relations: ['items'] });
  }

  async updateOrderStaus(id: number, updateStatus: UpdateOrderStatus) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`order with id: ${id} is not found`);
    }
    if (
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `order status cannot be changed when its delivered or cancelled`,
      );
    }
    order.status = updateStatus.status;
    return await this.orderRepository.save(order);
  }

   async consumedConfirmedOrder() {
    await this.consumer.subscribe({ topic: 'hiruni.inventory.update' });
    await this.consumer.run({
      eachMessage: async ({message}) => {
        console.log('----------new order confirmation arrived----------');
        const {customerId, item} = JSON.parse(message.value.toString());
        
        // Save to database
        const order = this.orderRepository.create({
          customerId,
          status: 'CONFIRMED',
        });
        const savedOrder = await this.orderRepository.save(order);
        const orderItems = item.map((item) =>
          this.orderItemRepository.create({
            productId: item.productId,
            price: item.price,
            quantity: item.quantity,
            order: savedOrder,
          }),
        );
        const savedOrderItems = await this.orderItemRepository.save(orderItems);
  
        // Publish order.confirmed event
        await this.producer.send({
          topic: 'hiruni.order.confirmed',
          messages: [{
            value: JSON.stringify({
              orderId: savedOrder.id,
              customerId: savedOrder.customerId,
              status: savedOrder.status,
              items: savedOrderItems
            })
          }]
        });
      }
    });
  }
}
