import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class NotificationsService implements OnModuleInit {
  private kafka = new Kafka({
    brokers: ['localhost:9092']
  });
  private consumer = this.kafka.consumer({ groupId: 'notification-service' });

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'hiruni.order.confirmed' });
    console.log('Consumer is working');
    
    await this.consumer.run({
      
      eachMessage: async ({ message }) => {
        const orderData = JSON.parse(message.value.toString());
        console.log('Order successfully created:', {
          orderId: orderData.orderId,
          customerId: orderData.customerId,
          status: orderData.status
        });
      }
    });
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }
}