import {ExecuteOrder} from "../application/order/execute-order.usecase";
import {Order} from "../domain/order/order.entity";
import {OrderStatus} from "../domain/order/order-status.enum";
import {OrderDomainError} from "../domain/order/order-domain-error";

describe("ExecuteOrder UseCase", () => {
    let mockRepo: any;
    let mockBroker: any;
    let useCase: ExecuteOrder;

    beforeEach(() => {
        mockRepo = {
            findById: jest.fn(),
            save: jest.fn(),
        };

        mockBroker = {
            publish: jest.fn(),
        };

        useCase = new ExecuteOrder(mockRepo, mockBroker);
    });

    it("should execute a pending order and publish an event", async () => {
        const order = new Order("order-1", "user-1", "BTC", "USDT", 1);
        mockRepo.findById.mockResolvedValue(order);
        mockRepo.save.mockResolvedValue(order);

        await useCase.execute(order.id!);

        expect(order.status).toBe(OrderStatus.EXECUTED);
        expect(mockRepo.save).toHaveBeenCalledWith(order);
        expect(mockBroker.publish).toHaveBeenCalledWith("order.updated", {
            orderId: order.id,
            status: order.status,
        });
    });

    it("should throw an error if order is not found", async () => {
        mockRepo.findById.mockResolvedValue(null);

        await expect(useCase.execute("non-existing-id")).rejects.toThrow("Order not found");
    });

    it("should throw an error if order is not pending", async () => {
        const order = new Order("order-2", "user-1", "BTC", "USDT", 1, OrderStatus.EXECUTED);
        mockRepo.findById.mockResolvedValue(order);

        await expect(useCase.execute(order.id!)).rejects.toThrow(OrderDomainError);
    });
});
