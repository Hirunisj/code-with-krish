import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { createOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
    constructor(private ordersService: OrdersService) {}

    @Post()
    async create(@Body() createOrderDto: createOrderDto) {
        return await this.ordersService.create(createOrderDto);
    }

    @Get(':id')
    async fetch(@Param('id') id: number) {
        return await this.ordersService.fetch(id);
        
    }
    //pending

    @Patch(':id/status')
    async updateOrderStatus(@Param('id') id: number, @Body() updateOrderStatus: any) {
        return await this.ordersService.updateOrderStatus(id, updateOrderStatus);
    }

    
}
