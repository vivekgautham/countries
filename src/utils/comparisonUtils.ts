export function calculateDensity(
  population: number,
  area?: number,
): number | null {
  if (!area || area <= 0) return null;
  return Math.round(population / area);
}

export function findSharedItems(arrays: (string[] | undefined)[]): Set<string> {
  const counts = new Map<string, number>();
  arrays.forEach((arr) => {
    if (!arr) return;
    // Deduplicate within the same country
    new Set(arr).forEach((item) => {
      counts.set(item, (counts.get(item) || 0) + 1);
    });
  });

  const shared = new Set<string>();
  counts.forEach((count, item) => {
    if (count > 1) {
      shared.add(item);
    }
  });
  return shared;
}

export function getTopCountryByMetric<T extends { code: string }>(
  countries: T[],
  getValue: (c: T) => number | undefined | null,
): { topValue: number; topIds: string[] } {
  let max = -Infinity;
  const values = countries.map((c) => getValue(c) ?? -1);

  values.forEach((v) => {
    if (v > max && v > 0) {
      max = v;
    }
  });

  if (max <= 0 || max === -Infinity) {
    return { topValue: 0, topIds: [] };
  }

  const topIds: string[] = [];
  countries.forEach((c) => {
    const val = getValue(c);
    if (val === max) {
      topIds.push(c.code);
    }
  });

  return { topValue: max, topIds };
}

export function formatNumber(value?: number | null): string {
  if (value === undefined || value === null) return "N/A";
  return value.toLocaleString();
}

export function formatArea(area?: number | null): string {
  if (area === undefined || area === null || area === 0) return "N/A";
  return `${area.toLocaleString()} km² (${Math.round(area * 0.386102).toLocaleString()} sq mi)`;
}
