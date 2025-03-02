import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entity/order-item-entity';
import { createOrderDto } from './dto/create-order.dto';
import { OrderStatus, UpdateOrderStatus } from './dto/update-order.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class OrdersService {
    [x: string]: any;
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,

        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>,

        private readonly httpService: HttpService
    ) { }

    async create(createOrderDto: createOrderDto): Promise<any> {
        const { customerId, items } = createOrderDto;

        const customerUrl = `http://localhost:3002/customers/${customerId}`;
        let customerData;

        try {
            const customerResponse = await firstValueFrom(
                this.httpService.get(customerUrl)
            );

            if (!customerResponse.data) {
                return {
                    status: 404,
                    message: `Customer with id: ${customerId} not found`,
                    error: 'Not Found'
                };
            }
            customerData = customerResponse.data;

        } catch (error) {
            if (error.response?.status === 404) {
                return {
                    status: 404,
                    message: `Customer with id: ${customerId} not found`,
                    error: 'Not Found'
                };
            }
            return {
                status: 500,
                message: `Error validating customer`,
                error: error.message
            };
        }

        try {
            for (const item of items) {
                const stockValidationUrl = `http://localhost:3001/products/${item.productId}/validate?quantity=${item.quantity}`;

                const stockResponse = await firstValueFrom(
                    this.httpService.get(stockValidationUrl)
                );

                if (!stockResponse.data.available) {
                    return {
                        status: 400,
                        message: `Insufficient stock : ${item.productId}`,
                        error: 'Bad Request'
                    };
                }
            }
        } catch (error) {
            return {
                status: 500,
                message: 'Error validating product stock',
                error: error.message
            };
        }

        try {

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


            for (const item of items) {
                try {
                    await firstValueFrom(
                        this.httpService.post(
                            `http://localhost:3001/products/${item.productId}/quantity`,
                            { quantity: item.quantity },
                            { headers: { 'Content-Type': 'application/json' } }
                        )
                    );
                } catch (error) {

                    return {
                        status: 500,
                        message: `Failed to reduce stock for product ${item.productId}`,
                        error: error.message
                    };
                }
            }

            const completeOrder = await this.orderRepository.findOne({
                where: { id: savedOrder.id },
                relations: ['orderItems'],
            });

            if (!completeOrder) {
                throw new NotFoundException(`Order with id: ${savedOrder.id} not found`);
            }


            return {
                ...completeOrder,
                customer: customerData
            };

        } catch (error) {
            return {
                status: 500,
                message: 'Error creating order',
                error: error.message
            };
        }
    }

    async fetchAll(): Promise<Order[]> {
        return await this.orderRepository.find({
            relations: ['orderItems'],
            order: {
                createdAt: 'DESC'
            }
        });
    }

    async updateOrderStatus(id: number, updateOrderStatus: UpdateOrderStatus) {
        const order = await this.orderRepository.findOne({ where: { id } });
        if (!order) {
            throw new NotFoundException('Order with id: ${id} not found');
        }
        if (order.status === OrderStatus.DELIVERED ||
            order.status === OrderStatus.CANCELLED) {
            throw new NotFoundException('Order status cannot be changed');
        }
        order.status = updateOrderStatus.status;
        return await this.orderRepository.save(order);


    }

}