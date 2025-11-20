import {OrderModel} from "../../infrastructure/db/model/order.model";

export class OrderMapper {
    static toPersistence(order: Order): Partial<OrderModel> {
        return {
            id: order.id,
            userId: order.userId,
            originToken: order.originToken,
            destinationToken: order.destinationToken,
            amount: order.amount.toString(),
            status: order.status,
        }
    }

    static toDomain(model: OrderModel): Order {
        return new Order(
            model.id,
            model.userId,
            model.originToken,
            model.destinationToken,
            Number(model.amount),
            model.status
        );
    }
}