import { z } from "zod";

export const actionOrderSchema = z.object({
    id: z.string().uuidv4("Invalid order ID")
});

export type ActionOrderDto = z.infer<typeof actionOrderSchema>;
