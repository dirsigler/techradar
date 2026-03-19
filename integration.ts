import type { AstroIntegration } from 'astro';
import type { TechRadarUserConfig } from './config';
import { resolveConfig } from './config';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const PKG_DIR = path.dirname(fileURLToPath(import.meta.url));

export function createIntegration(
  userConfig: TechRadarUserConfig,
): AstroIntegration {
  const config = resolveConfig(userConfig);

  return {
    name: '@dirsigler/astro-techradar',
    hooks: {
      'astro:config:setup'({ injectRoute, updateConfig, config: astroConfig }) {
        const bp = config.basePath; // e.g. "" or "/techradar"

        // Inject all routes (prefixed with basePath)
        injectRoute({
          pattern: `${bp}/`,
          entrypoint: path.join(PKG_DIR, 'src/pages/index.astro'),
        });
        injectRoute({
          pattern: `${bp}/404`,
          entrypoint: path.join(PKG_DIR, 'src/pages/404.astro'),
        });
        injectRoute({
          pattern: `${bp}/segments/[segment]`,
          entrypoint: path.join(PKG_DIR, 'src/pages/segments/[segment].astro'),
        });
        injectRoute({
          pattern: `${bp}/technology/[...slug]`,
          entrypoint: path.join(
            PKG_DIR,
            'src/pages/technology/[...slug].astro',
          ),
        });
        // Resolve theme CSS
        let themeCSS = '';
        const builtinPath = path.join(
          PKG_DIR,
          `src/themes/${config.theme}.css`,
        );
        if (existsSync(builtinPath)) {
          themeCSS = readFileSync(builtinPath, 'utf-8');
        } else if (existsSync(config.theme)) {
          // User provided an absolute or relative path to a custom theme
          themeCSS = readFileSync(config.theme, 'utf-8');
        }

        // Virtual modules for config and theme
        const VIRTUAL_CONFIG = 'virtual:techradar/config';
        const RESOLVED_CONFIG = '\0' + VIRTUAL_CONFIG;
        const VIRTUAL_THEME = 'virtual:techradar/theme';
        const RESOLVED_THEME = '\0' + VIRTUAL_THEME;

        // Register astro-icon if not already added by the user
        const hasIcon = astroConfig.integrations.some((i) => i.name === 'astro-icon');
        if (!hasIcon) {
          updateConfig({ integrations: [icon()] });
        }

        updateConfig({
          vite: {
            plugins: [
              tailwindcss(),
              {
                name: 'techradar-virtual-modules',
                resolveId(id: string) {
                  if (id === VIRTUAL_CONFIG) return RESOLVED_CONFIG;
                  if (id === VIRTUAL_THEME) return RESOLVED_THEME;
                },
                load(id: string) {
                  if (id === RESOLVED_CONFIG) {
                    return `export default ${JSON.stringify(config)}`;
                  }
                  if (id === RESOLVED_THEME) {
                    return `export default ${JSON.stringify(themeCSS)}`;
                  }
                },
              },
            ],
          },
        });
      },
    },
  };
}
