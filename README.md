# @dirsigler/techradar

[![npm version](https://img.shields.io/npm/v/@dirsigler/techradar)](https://www.npmjs.com/package/@dirsigler/techradar)
[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-BC52EE?logo=astro&logoColor=white)](https://astro.build)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An [Astro](https://astro.build) integration that adds a complete, interactive technology radar to your site. Track technology adoption decisions across your organization with a visual radar chart, categorized segments, and detailed technology pages — all driven by simple Markdown files.

**[View Live Demo](https://demo.techradar.irsigler.dev)**

---

## Preview

|                  Radar Overview                  |                     Technology Detail                      |
| :----------------------------------------------: | :--------------------------------------------------------: |
| ![Radar Light](docs/screenshots/radar-light.png) | ![Technology Page](docs/screenshots/technology-detail.png) |
|  ![Radar Dark](docs/screenshots/radar-dark.png)  |     ![Segment Page](docs/screenshots/segment-page.png)     |

---

## Features

- **Interactive SVG Radar** — Technologies plotted across four rings (Adopt, Trial, Assess, Hold) with hover tooltips and click-through navigation
- **Markdown-Driven** — Add technologies by dropping `.md` files into `segments/`. No code changes needed
- **Theming & Dark Mode** — Ships with a default theme and [Catppuccin Mocha](https://catppuccin.com). Create your own with CSS custom properties
- **Fully Static & Fast** — Builds to plain HTML/CSS/JS. Deploy anywhere
- **Movement Indicators** — Mark technologies as moved in/out to highlight recent changes
- **SEO Ready** — Open Graph, Twitter Cards, canonical URLs, and custom 404 page

---

## Quick Start

### 1. Install

```bash
npm install @dirsigler/techradar astro
```

### 2. Add the integration

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import techradar from "@dirsigler/techradar";

export default defineConfig({
  site: "https://your-site.example.com",
  integrations: [
    techradar({
      title: "Tech Radar",
    }),
  ],
});
```

### 3. Define the content collections

Create `src/content.config.ts`:

```ts
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { segmentSchema, technologySchema } from "@dirsigler/techradar/schemas";

const segments = defineCollection({
  loader: glob({ pattern: "*/index.md", base: "./segments" }),
  schema: segmentSchema,
});

const technologies = defineCollection({
  loader: glob({ pattern: "*/!(index).md", base: "./segments" }),
  schema: technologySchema,
});

export const collections = { segments, technologies };
```

### 4. Add your content

```text
segments/
├── cloud/
│   ├── index.md          # Segment metadata
│   ├── kubernetes.md
│   └── terraform.md
├── frameworks/
│   ├── index.md
│   ├── astro.md
│   └── react.md
└── ...
```

Each segment needs an `index.md`:

```markdown
---
title: Cloud
color: "#3b82f6"
order: 1
---
```

Each technology file:

```markdown
---
title: Kubernetes
ring: adopt
moved: 0
---

Your description in Markdown. Explain why this technology is in this ring
and what your experience has been.
```

### 5. Run

```bash
npx astro dev
```

---

## Configuration

All options are passed to the `techradar()` integration in `astro.config.mjs`:

```js
techradar({
  // Required
  title: "Tech Radar",

  // Optional
  logo: "/logo.svg", // Path to logo in public/
  footerText: "Built by the Platform Team", // Supports HTML
  repositoryUrl: "https://github.com/your-org/your-radar",
  editBaseUrl: "https://github.com/your-org/your-radar/edit/main/segments",
  theme: "default", // 'default' | 'catppuccin-mocha' | path to custom CSS
  socialLinks: [
    {
      label: "GitHub",
      href: "https://github.com/your-org/your-radar",
      icon: "M12 .297c-6.63 0-12 5.373-12 12...", // SVG path data (24x24 viewBox)
    },
  ],
});
```

### Technology Frontmatter

| Field   | Type                                       | Description                                     |
| :------ | :----------------------------------------- | :---------------------------------------------- |
| `title` | `string`                                   | Display name                                    |
| `ring`  | `'adopt' \| 'trial' \| 'assess' \| 'hold'` | Which ring the technology belongs to            |
| `moved` | `-1 \| 0 \| 1`                             | Movement indicator (-1 = out, 0 = none, 1 = in) |

### Segment Frontmatter

| Field   | Type     | Description                  |
| :------ | :------- | :--------------------------- |
| `title` | `string` | Segment display name         |
| `color` | `string` | Hex color (e.g. `"#3b82f6"`) |
| `order` | `number` | Quadrant position (1-4)      |

---

## Theming

Themes are CSS files defining `--radar-*` custom properties.

| Theme              | Description                                           |
| :----------------- | :---------------------------------------------------- |
| `default`          | Clean light/dark theme (follows system preference)    |
| `catppuccin-mocha` | [Catppuccin Mocha](https://catppuccin.com) dark theme |

To create a custom theme, copy the [default theme](src/themes/default.css), save it in your project, and point to it:

```js
techradar({
  theme: "./src/my-theme.css",
});
```

---

## Example

See the [techradar-demo](https://github.com/dirsigler/techradar-demo) repository for a complete working example.

---

## License

[MIT](LICENSE) — Dennis Irsigler
