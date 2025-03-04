
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { Vehicle } from './entity/vehicle.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Vehicle])],
    providers: [VehiclesService],
    controllers: [VehiclesController]
})
export class VehiclesModule {}
