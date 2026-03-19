export interface SocialLink {
  label: string;
  href: string;
  icon?: string; // optional SVG path data (24x24 viewBox)
}

export interface TechRadarUserConfig {
  /** Navbar title text */
  title: string;

  /** Path to a logo image in the public/ directory (e.g. "/logo.svg"). Omit to show title only. */
  logo?: string;

  /** Footer text. Supports simple HTML. */
  footerText?: string;

  /** Base URL of the repository. Used for license link and edit URLs. */
  repositoryUrl?: string;

  /** Base URL for "Edit" links on technology pages. If omitted, derived from repositoryUrl. */
  editBaseUrl?: string;

  /** Social links shown in the footer. */
  socialLinks?: SocialLink[];

  /** Theme name — matches a built-in CSS file ('default' | 'catppuccin-mocha') or a path to a custom CSS file. Default: 'default' */
  theme?: string;
}

export interface ResolvedConfig {
  title: string;
  logo?: string;
  footerText: string;
  repositoryUrl?: string;
  editBaseUrl?: string;
  socialLinks: SocialLink[];
  theme: string;
}

export function resolveConfig(user: TechRadarUserConfig): ResolvedConfig {
  return {
    title: user.title,
    logo: user.logo,
    footerText: user.footerText ?? '',
    repositoryUrl: user.repositoryUrl,
    editBaseUrl:
      user.editBaseUrl ??
      (user.repositoryUrl
        ? `${user.repositoryUrl}/edit/main/segments`
        : undefined),
    socialLinks: user.socialLinks ?? [],
    theme: user.theme ?? 'default',
  };
}
