import {OrderRepository} from "../../infrastructure/repository/order.repository";
import {MockBroker} from "../../infrastructure/mock-broker";
import {CreateOrderDTO} from "../../presentation/order/dto/create-order.dto";
import {Order} from "../../domain/order/order.entity";

export class CreateOrder {

    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly mockBroker: MockBroker
    ) {
    }

    async execute(dto: CreateOrderDTO): Promise<Order> {
        const order = new Order(
            null,
            dto.userId,
            dto.originToken,
            dto.destinationToken,
            dto.amount
        );

        const savedOrder = await this.orderRepository.save(order);

        this.mockBroker.publish("order.created", {
            id: savedOrder.id,
            userId: savedOrder.userId,
            originToken: savedOrder.originToken,
            destinationToken: savedOrder.destinationToken,
            amount: savedOrder.amount,
            status: savedOrder.status,
        });

        return savedOrder;
    }
}