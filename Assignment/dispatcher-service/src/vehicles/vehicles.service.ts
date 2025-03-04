import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entity/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { Kafka } from 'kafkajs';
@Injectable()
export class VehiclesService {
    createVehicle(createVehicleDto: CreateVehicleDto): Vehicle | PromiseLike<Vehicle> {
        throw new Error('Method not implemented.');
    }
    private kafka = new Kafka({brokers: ['localhost:9092']});
    private readonly consumer = this.kafka.consumer({groupId: 'hiruni-dispatcher-service'});
    private readonly logger = new Logger(VehiclesService.name);

    constructor(
        @InjectRepository(Vehicle)
        private readonly vehicleRepository: Repository<Vehicle>
    ) {}

    async onModuleInit() {
        await this.consumer.connect();
        await this.consumer.subscribe({ topic: 'hiruni.order.confirmed' });
        await this.handleOrderConfirmed();
    }

    async handleOrderConfirmed() {
        await this.consumer.run({
            eachMessage: async ({ message }) => {
                const orderData = JSON.parse(message.value.toString());
                const { orderId, city } = orderData;

                const vehicles = await this.getVehiclesByCity(city);

                if (!vehicles || vehicles.length === 0) {
                    this.logger.warn(`Cannot find vehicle for order ${orderId}`);
                    return;
                }

                this.logger.log(`Found ${vehicles.length} vehicles for order ${orderId} in ${city}`);
            }
        });
    }

    async getVehiclesByCity(city: string): Promise<Vehicle[]> {
        return await this.vehicleRepository.find({
            where: { city }
        });
    }
}