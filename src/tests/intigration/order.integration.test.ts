import request from "supertest";
import app from "../../app";
import { AppDataSource } from "../../infrastructure/db/datasource";
import { OrderRepository } from "../../infrastructure/repository/order.repository";
import { initiator } from "../../initiator";
import { MockBroker } from "../../infrastructure/mock-broker";
import { OrderStatus } from "../../domain/order/order-status.enum";

describe("Order Integration Tests", () => {
    let orderRepo: OrderRepository;
    let mockBroker: MockBroker;
    let createdOrderId: string;

    beforeAll(async () => {
        await AppDataSource.initialize();
        orderRepo = initiator.orderRepository;
        mockBroker = initiator.mockBroker;
    });

    afterAll(async () => {
        await AppDataSource.destroy();
    });

    it("should create a new order", async () => {
        const res = await request(app)
            .post("/orders")
            .send({
                userId: "user-1",
                originToken: "BTC",
                destinationToken: "ETH",
                amount: 1.2
            });

        expect(res.status).toBe(201);
        createdOrderId = res.body.id;
        const orderInDb = await orderRepo.findById(createdOrderId);
        expect(orderInDb).toBeDefined();
        expect(orderInDb?.status).toBe(OrderStatus.PENDING);
    });

    it("should execute the order", async () => {
        const publishSpy = jest.spyOn(mockBroker, "publish");

        await request(app)
            .patch("/orders/execute")
            .send({ id: createdOrderId })
            .expect(200);

        const orderInDb = await orderRepo.findById(createdOrderId);
        expect(orderInDb?.status).toBe(OrderStatus.EXECUTED);

        expect(publishSpy).toHaveBeenCalledWith(
            "order.updated",
            expect.objectContaining({ orderId: createdOrderId, status: OrderStatus.EXECUTED })
        );
    });

    it("should not execute an already executed order", async () => {
        const res = await request(app)
            .patch("/orders/execute")
            .send({ id: createdOrderId });

        expect(res.status).toBe(400);
    });

    it("should cancel a new order", async () => {
        const resCreate = await request(app)
            .post("/orders")
            .send({
                userId: "user-2",
                originToken: "ETH",
                destinationToken: "BTC",
                amount: 2
            });

        const newOrderId = resCreate.body.id;

        const publishSpy = jest.spyOn(mockBroker, "publish");

        await request(app)
            .patch("/orders/cancel")
            .send({ id: newOrderId })
            .expect(200);

        const orderInDb = await orderRepo.findById(newOrderId);
        expect(orderInDb?.status).toBe(OrderStatus.CANCELED);

        expect(publishSpy).toHaveBeenCalledWith(
            "order.updated",
            expect.objectContaining({ orderId: newOrderId, status: OrderStatus.CANCELED })
        );
    });

    it("should return filtered orders", async () => {
        const res = await request(app)
            .get("/orders")
            .query({ userId: "user-1", status: OrderStatus.EXECUTED })
            .expect(200);

        expect(res.body.length).toBeGreaterThanOrEqual(1);
        expect(res.body[0].status).toBe(OrderStatus.EXECUTED);
    });
});
