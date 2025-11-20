import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

export enum OrderStatus {
    PENDING = "PENDING",
    EXECUTED = "EXECUTED",
    CANCELED = "CANCELED",
}

@Entity("orders")
export class OrderModel {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    userId: string;

    @Column()
    originToken: string;

    @Column()
    destinationToken: string;

    @Column("decimal", {precision: 18, scale: 8})
    amount: number;

    @Column({
        type: "enum",
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    status: OrderStatus;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    constructor(
        userId: string,
        originToken: string,
        destinationToken: string,
        amount: number,
        status: OrderStatus = OrderStatus.PENDING
    ) {
        this.userId = userId;
        this.originToken = originToken;
        this.destinationToken = destinationToken;
        this.amount = amount;
        this.status = status;
    }
}
