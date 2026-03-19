export const RINGS = ['adopt', 'trial', 'assess', 'hold'] as const;
export type Ring = (typeof RINGS)[number];

export const RING_RADII: Record<Ring, { inner: number; outer: number }> = {
  adopt: { inner: 0, outer: 100 },
  trial: { inner: 100, outer: 200 },
  assess: { inner: 200, outer: 300 },
  hold: { inner: 300, outer: 400 },
};

export const RING_LABELS: Record<Ring, string> = {
  adopt: 'Adopt',
  trial: 'Trial',
  assess: 'Assess',
  hold: 'Hold',
};

export const RING_DESCRIPTIONS: Record<Ring, string> = {
  adopt: 'Technologies we have high confidence in and recommend for broad use across projects.',
  trial: 'Technologies worth pursuing. We see potential and recommend trying them on projects that can handle the risk.',
  assess: 'Technologies worth exploring to understand how they might affect our work. Not yet ready for trial.',
  hold: 'Technologies we have reservations about. They should not be used for new projects but may exist in legacy systems.',
};

const CENTER = 400;
const PADDING = 12;

/** Simple deterministic hash from a string to a number in [0, 1). */
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return (Math.abs(h) % 10000) / 10000;
}

/** Returns the angular range (in radians) for a given quadrant order (1-4). */
export function quadrantAngles(order: number): { start: number; end: number } {
  const mapping: Record<number, { start: number; end: number }> = {
    1: { start: (3 * Math.PI) / 2, end: 2 * Math.PI },
    2: { start: 0, end: Math.PI / 2 },
    3: { start: Math.PI / 2, end: Math.PI },
    4: { start: Math.PI, end: (3 * Math.PI) / 2 },
  };
  return mapping[order] ?? mapping[1];
}

export interface DotPosition {
  x: number;
  y: number;
  title: string;
  ring: Ring;
  color: string;
  moved: number;
  slug: string;
  segment: string;
}

/**
 * Position all technology dots on the radar, avoiding collisions.
 */
export function positionDots(
  technologies: Array<{
    title: string;
    ring: Ring;
    moved: number;
    slug: string;
    segment: string;
    color: string;
    order: number;
  }>,
): DotPosition[] {
  const placed: DotPosition[] = [];

  for (const tech of technologies) {
    const { inner, outer } = RING_RADII[tech.ring];
    const angles = quadrantAngles(tech.order);
    const anglePadding = 0.08;
    const radiusPadding = PADDING;

    let bestX = CENTER;
    let bestY = CENTER;
    let bestDist = -1;

    for (let attempt = 0; attempt < 30; attempt++) {
      const h1 = hash(tech.title + attempt);
      const h2 = hash(attempt + tech.title + 'y');

      const r =
        inner + radiusPadding + h1 * (outer - inner - 2 * radiusPadding);
      const a =
        angles.start + anglePadding + h2 * (angles.end - angles.start - 2 * anglePadding);

      const cx = CENTER + r * Math.cos(a);
      const cy = CENTER + r * Math.sin(a);

      let minDist = Infinity;
      for (const p of placed) {
        const dx = cx - p.x;
        const dy = cy - p.y;
        minDist = Math.min(minDist, Math.sqrt(dx * dx + dy * dy));
      }

      if (minDist > bestDist) {
        bestDist = minDist;
        bestX = cx;
        bestY = cy;
      }
    }

    placed.push({
      x: bestX,
      y: bestY,
      title: tech.title,
      ring: tech.ring,
      color: tech.color,
      moved: tech.moved,
      slug: tech.slug,
      segment: tech.segment,
    });
  }

  return placed;
}
