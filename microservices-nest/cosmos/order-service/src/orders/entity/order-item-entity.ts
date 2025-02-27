import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    productID: number;

    @Column()
    price: number;

    @Column()
    quantity: number;

    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    order: Order;
}