import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import {Vehicle} from './entity/vehicle.entity';

@Controller('vehicles')
export class VehiclesController {
    constructor(private readonly vehicleService: VehiclesService) {}

    @Post()
    async registerVehicle(@Body() createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
        return this.vehicleService.createVehicle(createVehicleDto);
    }
    @Get() 
    async getVehiclesByCity(@Param('city') city: string): Promise<Vehicle[]> {
        return this.vehicleService.getVehiclesByCity(city);
}
}

