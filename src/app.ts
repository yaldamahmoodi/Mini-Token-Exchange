import express from "express";
import dotenv from "dotenv";
import orderRoutes from "./routes/order/order.routes";
import {apiLimiter} from "./middlewares/rate-limit.middleware";

dotenv.config();

const app = express();

app.use(express.json());
app.use(apiLimiter);

app.use("/orders", orderRoutes);

app.get("/", (req, res) => {
    res.send("Server is running");
});

export default app;
