import { z } from 'astro/zod';
import { RINGS } from './src/lib/radar';

const ringEnum = z.enum(RINGS);

export const segmentSchema = z.object({
  title: z.string(),
  order: z.number().int().min(1).max(4),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export const technologySchema = z.object({
  title: z.string(),
  ring: ringEnum,
  moved: z.number().int().min(-1).max(1).default(0),
  history: z
    .array(
      z.object({
        date: z.string(),
        ring: ringEnum,
        description: z.string().optional(),
      }),
    )
    .optional(),
  owner: z
    .object({
      name: z.string(),
      url: z.string().url().optional(),
    })
    .optional(),
  links: z
    .array(
      z.object({
        label: z.string(),
        url: z.string().url(),
        type: z.enum(['docs', 'repo', 'website', 'community']).default('website'),
      }),
    )
    .optional(),
});
