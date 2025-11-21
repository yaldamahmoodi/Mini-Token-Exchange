import { OrderRepository } from "../infrastructure/repository/order.repository";
import {MockBroker} from "../infrastructure/mock-broker";
import {CreateOrder} from "../application/order/create-order.usecase";
import {CreateOrderDTO} from "../presentation/order/dto/create-order.dto";
import {Order} from "../domain/order/order.entity";

describe("CreateOrder UseCase", () => {
    let mockRepo: jest.Mocked<OrderRepository>;
    let mockBroker: jest.Mocked<MockBroker>;
    let createOrderUseCase: CreateOrder;

    beforeEach(() => {
        mockRepo = {
            save: jest.fn()
        } as unknown as jest.Mocked<OrderRepository>;

        mockBroker = {
            publish: jest.fn()
        } as unknown as jest.Mocked<MockBroker>;

        createOrderUseCase = new CreateOrder(mockRepo, mockBroker);
    });

    it("should save the order and publish an event", async () => {
        const dto: CreateOrderDTO = {
            userId: "user-1",
            originToken: "BTC",
            destinationToken: "USDT",
            amount: 2
        };

        const savedOrder = new Order(
            "order-1",
            dto.userId,
            dto.originToken,
            dto.destinationToken,
            dto.amount
        );
        mockRepo.save.mockResolvedValue(savedOrder);

        const result = await createOrderUseCase.execute(dto);

        expect(mockRepo.save).toHaveBeenCalledTimes(1);
        expect(mockRepo.save).toHaveBeenCalledWith(expect.any(Order));

        expect(mockBroker.publish).toHaveBeenCalledTimes(1);
        expect(mockBroker.publish).toHaveBeenCalledWith("order.created", {
            id: savedOrder.id,
            userId: savedOrder.userId,
            originToken: savedOrder.originToken,
            destinationToken: savedOrder.destinationToken,
            amount: savedOrder.amount,
            status: savedOrder.status
        });

        expect(result).toBe(savedOrder);
    });

    it("should throw if repository fails", async () => {
        const dto: CreateOrderDTO = {
            userId: "user-1",
            originToken: "BTC",
            destinationToken: "USDT",
            amount: 2
        };

        mockRepo.save.mockRejectedValue(new Error("DB error"));

        await expect(createOrderUseCase.execute(dto)).rejects.toThrow("DB error");
        expect(mockBroker.publish).not.toHaveBeenCalled();
    });
});
