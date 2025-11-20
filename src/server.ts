// import dotenv from "dotenv";
// dotenv.config();
//
// import express from "express";
// import { createServer } from "http";
// import { json } from "body-parser";
// import { initiator } from "./initiator";
// import { AppDataSource } from "./infrastructure/db/datasource";
//
// const app = express();
// app.use(json());
//
// // ⚡ Initialize DataSource قبل از هر چیز
// AppDataSource.initialize()
//     .then(() => {
//         console.log("DataSource initialized");
//
//         // --- Routes ---
//         const orderController = initiator.getOrderController();
//         app.post("/orders", orderController.create.bind(orderController));
//
//         const PORT = process.env.PORT || 3000;
//         const server = createServer(app);
//
//         server.listen(PORT, () => {
//             console.log(`Server running on port ${PORT}`);
//         });
//
//     })
//     .catch((err) => {
//         console.error("Failed to initialize DataSource:", err);
//         process.exit(1);
//     });
//
// import dotenv from "dotenv";
// dotenv.config();
//
// import express from "express";
// import { createServer } from "http";
// import { json } from "body-parser";
// import { initiator } from "./initiator";
// import { AppDataSource } from "./infrastructure/db/datasource";
//
// const app = express();
// app.use(json());
//
// AppDataSource.initialize()
//     .then(() => {
//         console.log("DataSource initialized");
//
//         // بعد از initialize، initiator رو init می‌کنیم
//         initiator.initialize();
//
//         const orderController = initiator.getOrderController();
//         app.post("/orders", orderController.create.bind(orderController));
//
//         const PORT = process.env.PORT || 3000;
//         const server = createServer(app);
//         server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//     })
//     .catch((err) => {
//         console.error("Failed to initialize DataSource:", err);
//         process.exit(1);
//     });


// src/server.ts
import dotenv from "dotenv";

dotenv.config();

import express from "express";
import {createServer} from "http";
import {json} from "body-parser";
import {AppDataSource} from "./infrastructure/db/datasource";
import {OrderRepository} from "./infrastructure/repository/order.repository";
import {MockBroker} from "./infrastructure/mock-broker";
import {CreateOrder} from "./application/order/create-order.usecase";
import {OrderController} from "./presentation/order/order.controller";
import {ExecuteOrder} from "./application/order/execute-order.usecase";
import {CancelOrder} from "./application/order/cancel-order.usecase";

const app = express();
app.use(json());

AppDataSource.initialize()
    .then(() => {
        console.log("DataSource initialized");

        const orderRepository = new OrderRepository();
        const mockBroker = new MockBroker();
        const createOrderUseCase = new CreateOrder(orderRepository, mockBroker);
        const executeOrderUseCase = new ExecuteOrder(orderRepository, mockBroker);
        const cancelOrderUseCase = new CancelOrder(orderRepository, mockBroker);
        const orderController = new OrderController(createOrderUseCase, executeOrderUseCase, cancelOrderUseCase);

        app.post("/orders", orderController.createOrder.bind(orderController));
        app.patch("/orders/execute", orderController.executeOrder.bind(orderController));
        app.patch('/orders/cancel', orderController.cancelOrder.bind(orderController));

        const PORT = process.env.PORT || 3000;
        const server = createServer(app);
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to initialize DataSource:", err);
        process.exit(1);
    });
