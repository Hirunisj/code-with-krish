import { IsEnum } from "class-validator";
import { stat } from "fs";

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

export class UpdateOrderStatus {
    @IsEnum(OrderStatus)
    status: OrderStatus;
}