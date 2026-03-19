import type { AstroIntegration } from 'astro';
import type { TechRadarUserConfig } from './config';
import { createIntegration } from './integration';

export default function techradar(
  userConfig: TechRadarUserConfig,
): AstroIntegration {
  return createIntegration(userConfig);
}

export type { TechRadarUserConfig, ResolvedConfig, SocialLink } from './config';
