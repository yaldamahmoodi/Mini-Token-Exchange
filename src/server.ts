// import dotenv from "dotenv";
//
// dotenv.config();
//
// import express from "express";
// import {createServer} from "http";
// import {json} from "body-parser";
// import {AppDataSource} from "./infrastructure/db/datasource";
// import {OrderRepository} from "./infrastructure/repository/order.repository";
// import {MockBroker} from "./infrastructure/mock-broker";
// import {CreateOrder} from "./application/order/create-order.usecase";
// import {OrderController} from "./presentation/order/order.controller";
// import {ExecuteOrder} from "./application/order/execute-order.usecase";
// import {CancelOrder} from "./application/order/cancel-order.usecase";
// import {GetFilteredOrders} from "./application/order/get-filtered-orders.usecase";
//
// const app = express();
// app.use(json());
//
// AppDataSource.initialize()
//     .then(() => {
//         console.log("DataSource initialized");
//
//         const orderRepository = new OrderRepository();
//         const mockBroker = new MockBroker();
//         const createOrderUseCase = new CreateOrder(orderRepository, mockBroker);
//         const executeOrderUseCase = new ExecuteOrder(orderRepository, mockBroker);
//         const cancelOrderUseCase = new CancelOrder(orderRepository, mockBroker);
//         const getFilteredOrdersUseCase = new GetFilteredOrders(orderRepository);
//         const orderController = new OrderController(createOrderUseCase, executeOrderUseCase, cancelOrderUseCase, getFilteredOrdersUseCase);
//
//         app.post("/orders", orderController.createOrder.bind(orderController));
//         app.patch("/orders/execute", orderController.executeOrder.bind(orderController));
//         app.patch('/orders/cancel', orderController.cancelOrder.bind(orderController));
//         app.get('/orders', orderController.getFilteredOrders.bind(orderController));
//
//         const PORT = process.env.PORT || 3000;
//         const server = createServer(app);
//         server.listen(PORT, () => {
//             console.log(`Server running on port ${PORT}`);
//         });
//     })
//     .catch((err) => {
//         console.error("Failed to initialize DataSource:", err);
//         process.exit(1);
//     });


import app from "./app";
import {AppDataSource} from "./infrastructure/db/datasource";
import {pinoLogger} from "./presentation/shared/pino-logger";

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await AppDataSource.initialize();
        pinoLogger.info("DataSource initialized");

        app.listen(PORT, () => {
            pinoLogger.info(`Server running on port ${PORT}`);
        });
    } catch (err) {
        pinoLogger.info(err, "Failed to initialize DataSource");
    }
}

startServer();
