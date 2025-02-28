import { BadRequestException, Injectable } from '@nestjs/common';
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
        const { name, quantity, price } = createInventoryDto;
    
        if (!name || typeof name !== 'string') {
            throw new BadRequestException('Name cannot be a empty string');
        }
    
        if (!quantity || typeof quantity !== 'number' || quantity < 0) {
            throw new BadRequestException('Quantity should be there and be a non-negative number');
        }
    
        if (!price || typeof price !== 'number' || price < 0) {
            throw new BadRequestException('Price should be thereand be a non-negative number');
        }
    
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