// src/app.ts
import express from "express";
import dotenv from "dotenv";
import orderRoutes from "./routes/order/order.routes";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/orders", orderRoutes);

app.get("/", (req, res) => {
    res.send("Server is running");
});

export default app;
