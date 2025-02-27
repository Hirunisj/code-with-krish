import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entity/order-item-entity';
import { createOrderDto } from './dto/create-order.dto';
import { OrderStatus, UpdateOrderStatus } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
    [x: string]: any;
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,

        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>
    )
    {}

    async create(createOrderDto: createOrderDto): Promise<Order> {
        const { customerId, items } = createOrderDto;
    
        const order = this.orderRepository.create({
            customerID: customerId,
            status: 'PENDING',
        });
    
        const savedOrder = await this.orderRepository.save(order);
    
        if (!items || !Array.isArray(items)) {
            throw new Error('Items must be a non-empty array');
        }
    
        const orderItems = items.map((item) => {
            return this.orderItemRepository.create({
                productID: item.productId,
                price: item.price,
                quantity: item.quantity,
                order: savedOrder,
            });
        });
    
        await this.orderItemRepository.save(orderItems);
        this.orderItemRepository.findOne({
            where: {
                id: savedOrder.id,
            },
            relations: ['items'],
        });
    
        return savedOrder;
    }

    async updateOrderStatus(id:number, updateOrderStatus: UpdateOrderStatus){
        const order = await this.orderRepository.findOne({where: {id}});
        if (!order){
            throw new NotFoundException('Order with id: ${id} not found');
        }
        if(order.status=== OrderStatus.DELIVERED ||
            order.status === OrderStatus.CANCELLED){
            throw new NotFoundException('Order status cannot be changed when its delivered or cancelled');
        }
        order.status = updateOrderStatus.status;
        return await this.orderRepository.save(order);
        

    }

}