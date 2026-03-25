export interface SocialLink {
  label: string;
  href: string;
  /** Lucide icon name (e.g. "github", "twitter", "globe"). Falls back to label text if unrecognized. */
  icon?: string;
}

export interface ColorModeConfig {
  /** Show the light/dark mode toggle in the header. Default: true */
  toggle?: boolean;
  /** Color mode preference. When toggle is false this locks the mode. Default: 'system' */
  mode?: 'light' | 'dark' | 'system';
}

export interface ResolvedColorMode {
  toggle: boolean;
  mode: 'light' | 'dark' | 'system';
}

export interface TechRadarUserConfig {
  /** Brand name shown in the navbar. */
  name: string;

  /** Main page title shown as the h1 heading. Falls back to name if not set. */
  title?: string;

  /** Subtitle shown below the title on the main page. */
  subtitle?: string;

  /**
   * URL path prefix where the tech radar is mounted (e.g. "/techradar").
   * Useful when embedding the radar into a larger Astro site.
   * Default: "" (root)
   */
  basePath?: string;

  /** Logo image — either a path in public/ (e.g. "/logo.svg") or an external HTTPS URL. Omit to show title only. */
  logo?: string;

  /** Footer text. Supports simple HTML. */
  footerText?: string;

  /** Show "Edit this page" links on technology pages. Default: true */
  allowEditing?: boolean;

  /** Base URL for "Edit" links on technology pages (e.g. "https://github.com/org/repo/edit/main/segments"). */
  editBaseUrl?: string;

  /** Social links shown in the footer. */
  socialLinks?: SocialLink[];

  /** Theme name — matches a built-in CSS file ('default' | 'catppuccin-mocha') or a path to a custom CSS file. Default: 'default' */
  theme?: string;

  /** Color mode configuration. */
  color?: ColorModeConfig;
}

export interface ResolvedConfig {
  name: string;
  title: string;
  subtitle?: string;
  /** Normalized base path with leading slash, no trailing slash. Empty string when mounted at root. */
  basePath: string;
  logo?: string;
  footerText: string;
  editBaseUrl?: string;
  socialLinks: SocialLink[];
  theme: string;
  color: ResolvedColorMode;
}

/** Normalize a user-supplied path: ensure leading slash, strip trailing slash. Returns "" for root. */
function normalizeBasePath(raw?: string): string {
  if (!raw) return '';
  // Strip leading/trailing slashes, then re-add leading slash
  const trimmed = raw.replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}` : '';
}

export function resolveConfig(user: TechRadarUserConfig): ResolvedConfig {
  return {
    name: user.name,
    title: user.title ?? user.name,
    subtitle: user.subtitle,
    basePath: normalizeBasePath(user.basePath),
    logo: user.logo,
    footerText: user.footerText ?? '',
    editBaseUrl:
      (user.allowEditing ?? true) === false
        ? undefined
        : user.editBaseUrl,
    socialLinks: user.socialLinks ?? [],
    theme: user.theme ?? 'default',
    color: {
      toggle: user.color?.toggle ?? true,
      mode: user.color?.mode ?? 'system',
    },
  };
}
