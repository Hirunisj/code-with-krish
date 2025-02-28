import { BadRequestException, Injectable } from '@nestjs/common';
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
        const { name, email, address } = createCustomerDto;

        if (!name || typeof name !== 'string') {
            throw new BadRequestException('Name should be there and should be a string');
        }

        if (!email || typeof email !== 'string') {
            throw new BadRequestException('Email should be there and should be a string');
        }

        if (typeof address !== 'string') {
            throw new BadRequestException('Address shold be a string');
        }

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