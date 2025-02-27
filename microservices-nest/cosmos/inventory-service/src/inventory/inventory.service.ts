import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { Inventory } from './entity/inventory.entity';

@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(Inventory)
        private inventoryRepository: Repository<Inventory>,
    ) {}

    async create(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
        const product = this.inventoryRepository.create(createInventoryDto);
        return await this.inventoryRepository.save(product);
    }

    async findAll(): Promise<Inventory[]> {
        return await this.inventoryRepository.find();
    }

    async findOne(id: number): Promise<Inventory> {
        return await this.inventoryRepository.findOne({ where: { id } });
    }

    async validateStock(id: number, quantity: number): Promise<boolean> {
        const product = await this.findOne(id);
        return product ? product.quantity >= quantity : false;
    }
}