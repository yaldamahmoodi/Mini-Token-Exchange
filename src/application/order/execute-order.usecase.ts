import {IOrderRepository} from "../../domain/order/order.repository";
import {MockBroker} from "../../infrastructure/mock-broker";

export class ExecuteOrder {
    constructor(
        private readonly orderRepo: IOrderRepository,
        private readonly broker: MockBroker
    ) {
    }

    async execute(orderId: string): Promise<void> {
        const order = await this.orderRepo.findById(orderId);
        if (!order) throw new Error("Order not found");

        order.execute();
        await this.orderRepo.save(order);

        this.broker.publish("order.updated", {orderId: order.id, status: order.status});
    }
}
