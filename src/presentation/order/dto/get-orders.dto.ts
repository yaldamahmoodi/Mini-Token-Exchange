import {z} from "zod";

export const getOrdersQuerySchema = z.object({
    userId: z.string().optional(),
    status: z.enum(["PENDING", "EXECUTED", "CANCELED"]).optional(),
});

export type GetOrdersQueryDto = z.infer<typeof getOrdersQuerySchema>;
