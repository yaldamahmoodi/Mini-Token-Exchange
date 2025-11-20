import {Request, Response} from "express";
import {CreateOrder} from "../../application/order/create-order.usecase";
import {createOrderSchema} from "./dto/create-order.dto";
import {ActionOrderDto, actionOrderSchema} from "./dto/action-order.dto";
import {ExecuteOrder} from "../../application/order/execute-order.usecase";
import {handleError} from "../shared/handle-error"
import {CancelOrder} from "../../application/order/cancel-order.usecase";

export class OrderController {
    constructor(private readonly createOrderUseCase: CreateOrder,
                private readonly executeOrderUseCase: ExecuteOrder,
                private readonly cancelOrderUseCase: CancelOrder,) {
        this.createOrder = this.createOrder.bind(this);
        this.executeOrder = this.executeOrder.bind(this);
        this.cancelOrder = this.cancelOrder.bind(this);
    }

    async createOrder(req: Request, res: Response) {
        try {
            const dto = createOrderSchema.parse(req.body);
            const result = await this.createOrderUseCase.execute(dto);
            return res.status(201).json(result);
        } catch (err: any) {
            return handleError(err, res);
        }
    }

    async executeOrder(req: Request, res: Response) {
        try {
            const dto: ActionOrderDto = actionOrderSchema.parse(req.body);
            await this.executeOrderUseCase.execute(dto.id);
            return res.status(200).json({message: "Order executed successfully"});
        } catch (err: any) {
            return handleError(err, res);
        }
    }

    async cancelOrder(req: Request, res: Response) {
        try {
            const dto: ActionOrderDto = actionOrderSchema.parse(req.body);
            await this.cancelOrderUseCase.execute(dto.id);
            return res.status(200).json({message: "Order canceled successfully"});
        } catch (err: any) {
            return handleError(err, res);
        }
    }

}
