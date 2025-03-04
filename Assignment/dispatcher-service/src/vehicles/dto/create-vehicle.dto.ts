import { IsString, IsInt } from 'class-validator';

export class CreateVehicleDto {
  @IsInt()
  vehicleNumber: number;

  @IsString()
  city: string;
}