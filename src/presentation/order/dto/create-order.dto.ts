import { z } from "zod";

export const createOrderSchema = z.object({
    userId: z.string(),
    originToken: z.string(),
    destinationToken: z.string(),
    amount: z.number(),
});

export type CreateOrderDTO = z.infer<typeof createOrderSchema>;
