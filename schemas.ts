import { z } from 'astro/zod';

export const segmentSchema = z.object({
  title: z.string(),
  order: z.number().int().min(1).max(4),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export const technologySchema = z.object({
  title: z.string(),
  ring: z.enum(['adopt', 'trial', 'assess', 'hold']),
  moved: z.number().int().min(-1).max(1).default(0),
});
