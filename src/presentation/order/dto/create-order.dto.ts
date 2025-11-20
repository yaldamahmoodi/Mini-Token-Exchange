import { z } from "zod";

export const createOrderSchema = z.object({
    userId: z.string().min(1, "userId is required"),
    originToken: z.string().min(1, "originToken is required"),
    destinationToken: z.string().min(1, "destinationToken is required"),
    amount: z.coerce.number().refine(val => val > 0, { message: "amount must be greater than 0" }),
});

export type CreateOrderDTO = z.infer<typeof createOrderSchema>;
