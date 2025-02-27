import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { Inventory } from './entity/inventory.entity';

@Controller('products')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) {}

    @Post()
    async create(@Body() createInventoryDto: CreateInventoryDto): Promise<Inventory> {
        return this.inventoryService.create(createInventoryDto);
    }

    @Get()
    async findAll(): Promise<Inventory[]> {
        return this.inventoryService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Inventory> {
        return this.inventoryService.findOne(id);
    }

    @Get(':id/validate')
    async validateStock(@Param('id') id: number): Promise<boolean> {
        const product = await this.inventoryService.findOne(id);
        return product.quantity > 0;
    }
}