function shimmer({
  panel,
  sweep,
}: {
  panel: number;
  sweep: number;
}): `data:image/${string}` {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" preserveAspectRatio="none">
      <style>
        .sweep { animation: sweep 1.6s ease-in-out infinite }
        @keyframes sweep {
          from { transform: translateX(-120px) }
          to { transform: translateX(120px) }
        }
      </style>
      <defs>
        <linearGradient id="s" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#fff" stop-opacity="0"/>
          <stop offset="0.5" stop-color="#fff" stop-opacity="${sweep}"/>
          <stop offset="1" stop-color="#fff" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="120" height="120" fill="#808080" fill-opacity="${panel}"/>
      <rect class="sweep" width="120" height="120" fill="url(#s)"/>
    </svg>`;

  const minified = svg.trim().replace(/\s+/g, " ").replace(/> </g, "><");

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(minified)}`;
}

export const SHIMMER = shimmer({ panel: 0.16, sweep: 0.45 });

export const SHIMMER_DARK = shimmer({ panel: 0.1, sweep: 0.14 });
