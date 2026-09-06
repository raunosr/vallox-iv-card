import { svg } from 'lit';
const paths: Record<string, string> = {
  home: 'M3 11 12 3l9 8M5 10v11h5v-7h4v7h5V10',
  away: 'M3 11 12 3l9 8M5 10v11h8M16 15l4 3-4 3M12 18h8',
  boost: 'm13 2-8 12h6l-1 8 9-13h-7z',
  fireplace: 'M12 3c1 5-5 6-5 11a5 5 0 0 0 10 0c0-3-2-5-2-5 0 4-4 4-3-6z',
  extra: 'M12 4v16M4 12h16', auto: 'm4 16 4-9 4 9m-6-3h4M15 8h5m-2-3v6M16 16h4',
  energy: 'm13 2-8 12h6l-1 8 9-13h-7z',
  fan: 'M10 10C3 11 2 5 6 3c4-2 6 2 6 6M14 10c2-7 8-5 8-1 0 5-4 5-8 4M12 14c5 5 1 10-3 8-4-2-2-6 1-9M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0',
  info: 'M12 11v6M12 7v.1M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
};
export const icon = (name: string) => svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d=${paths[name.toLowerCase()] ?? paths.info}/></svg>`;
