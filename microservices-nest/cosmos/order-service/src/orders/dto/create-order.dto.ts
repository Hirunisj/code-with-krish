import { IsInt, ValidateNested, IsArray } from 'class-validator';

class OrderItemDto {
    @IsInt()
    productId: number;

    @IsInt()
    price: number;

    @IsInt()
    quantity: number;
}

export class createOrderDto {
    @IsInt()
    customerId: number;

    @IsArray()
    @ValidateNested({ each: true })


    items: OrderItemDto[];
}