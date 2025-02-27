import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from './entity/customer.entity';

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(Customer)
        private customersRepository: Repository<Customer>,
    ) {}

    async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
        const customer = this.customersRepository.create(createCustomerDto);
        return await this.customersRepository.save(customer);
    }

    async findAll(): Promise<Customer[]> {
        return await this.customersRepository.find();
    }

    async findOne(id: number): Promise<Customer> {
        return await this.customersRepository.findOne({ where: { id } });
    }
}