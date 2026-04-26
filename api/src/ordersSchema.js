import { z } from 'zod';

export const orderLineSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.number().finite().nonnegative()
});

export const submitOrderBodySchema = z.object({
  customerEmail: z.string().email().max(320),
  customerName: z.string().min(1).max(200),
  phone: z.string().max(80).optional().default(''),
  shippingAddress: z.string().min(5).max(4000),
  lang: z.enum(['ca', 'es']).default('ca'),
  acceptPolicy: z.literal(true),
  lines: z.array(orderLineSchema).min(1).max(500)
});
