import { css } from 'lit';

export const cardStyles = css`
  :host { display:block; height:100%; min-width:0; color:var(--primary-text-color,#dfebf2); container-type:inline-size; --accent:var(--vallox-accent,color-mix(in srgb,#7bcfc1 45%,var(--primary-text-color,#dfebf2))); --core-plate-start:color-mix(in srgb,var(--primary-text-color,#dfebf2) 14%,var(--ha-card-background,var(--card-background-color,#12212b))); --core-plate-end:color-mix(in srgb,var(--primary-text-color,#dfebf2) 7%,var(--ha-card-background,var(--card-background-color,#12212b))); --muted:var(--secondary-text-color,#91a5b3); --line:color-mix(in srgb,var(--primary-text-color,#d8e6f0) 11%,transparent); }
  * { box-sizing:border-box; }
  ha-card { display:block; height:100%; overflow:hidden; border:1px solid var(--ha-card-border-color,var(--line)); border-radius:var(--ha-card-border-radius,24px); background:var(--ha-card-background,var(--card-background-color,#12212b)); box-shadow:var(--ha-card-box-shadow,0 8px 32px #00000014); }
  .surface { height:100%; display:flex; flex-direction:column; padding:16px; gap:8px; background:radial-gradient(ellipse at 70% 30%,#79cfbd09,transparent 65%); overflow:hidden; }
  button,select,input { font:inherit; color:inherit; }
  button { cursor:pointer; -webkit-tap-highlight-color:transparent; }
  button:disabled { opacity:.4; cursor:default; }
  button:focus-visible,select:focus-visible,input:focus-visible,summary:focus-visible,a:focus-visible { outline:2px solid var(--accent); outline-offset:3px; }
  button { min-height:44px; border:0; background:none; }
  .top { display:flex; align-items:center; justify-content:space-between; gap:8px; flex:none; min-height:44px; }
  .identity { min-width:0; }
  .eyebrow { display:flex; align-items:center; gap:7px; font-size:10px; text-transform:uppercase; letter-spacing:.14em; color:var(--muted); }
  .dot { width:5px;height:5px;border-radius:50%;background:var(--accent); flex:none; }
  .fan-readout { display:inline-flex;align-items:center;gap:4px;letter-spacing:.04em; }
  .fan-readout svg { width:16px;height:16px;flex:none; }
  .stopped .dot,.unknown .dot { background:var(--muted); }
  h2 { font-size:15px; font-weight:600; line-height:1.4; margin:3px 0 0; letter-spacing:-.02em; }
  .profile-chip { flex:none; border:1px solid var(--line); border-radius:30px; padding:0 12px; font-size:12px; display:flex; gap:6px; align-items:center; background:color-mix(in srgb,var(--accent) 6%,transparent); }
  .profile-chip svg { width:18px; height:18px; }
  .description { margin:0; color:var(--muted); font-size:11.5px; line-height:1.35; flex:none; height:2lh; display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden; }
  .scene { display:grid; flex:1 1 175px; min-height:0; grid-template-columns:minmax(0,1fr) minmax(106px,2.1fr) minmax(0,1fr); grid-template-rows:1fr 1fr; align-items:center; position:relative; }
  .air { text-align:left; min-width:0; padding:4px 0; display:flex; flex-direction:column; align-items:flex-start; justify-content:center; gap:2px; }
  .air.right { text-align:right; align-items:flex-end; }
  .air-label { font-size:12px; font-weight:600; line-height:1.25; }
  .air-value { white-space:nowrap; font-size:clamp(22px,calc(var(--value-scale,1) * 7cqw),36px); letter-spacing:-.04em; line-height:1.08; font-weight:var(--value-weight,600); font-variant-numeric:tabular-nums; }
  .unit { font-size:.4em; opacity:var(--unit-opacity,.65); margin-left:2px; letter-spacing:0; }
  .air-helper { font-size:10px; color:var(--muted); line-height:1.3; }
  .air-quality,.supply-chain { display:flex;flex-direction:column;max-width:100%;gap:0;font-size:11px;line-height:1.2;color:var(--muted);margin-top:2px; }
  .reading { display:flex;min-width:0;gap:3px;white-space:nowrap; }
  .reading-label { overflow:hidden;text-overflow:ellipsis;min-width:0; }
  .reading-value { flex:none; }
  .extract { grid-area:1 / 1; } .outdoor { grid-area:1 / 3; } .supply { grid-area:2 / 1; } .exhaust { grid-area:2 / 3; }
  .core { grid-area:1 / 2 / 3 / 3; width:100%; height:100%; min-height:0; position:relative; display:flex; flex-direction:column; align-items:center; justify-content:center; }
  .core-svg { width:100%; min-height:0; flex:1; max-height:290px; overflow:visible; }
  .core-frame { stroke:color-mix(in srgb,var(--primary-text-color,#deedf5) 55%,transparent);stroke-width:1.8; }
  .fin { stroke:var(--primary-text-color,#afc0ce);stroke-width:1;opacity:.18; }
  .air-track { fill:none;stroke:var(--ha-card-background,var(--card-background-color,#14232d));stroke-width:15;stroke-linecap:round; }
  .crossing-track { stroke-width:20; }
  .air-route { fill:none;stroke-width:10;stroke-linecap:round; }
  .air-motion { fill:none;stroke:#fff;stroke-width:5;stroke-dasharray:10 20;stroke-linecap:round;opacity:.85; }
  .flowing .air-motion { animation:airflow 2.4s linear infinite; }
  .resting .air-motion { display:none; } .resting .air-route { stroke:var(--muted);opacity:.2; }
  .efficiency-glass { fill:var(--ha-card-background,var(--card-background-color,#15232d));stroke:var(--line); }
  .core-value { font-size:27px; font-weight:600; fill:var(--primary-text-color,#e2ecf5); letter-spacing:-1px; }
  .core-unit { font-size:12px; fill:var(--muted); }
  .core-center { fill:var(--ha-card-background,var(--card-background-color,#15232d));stroke:var(--line); }
  .core-symbol { fill:none;stroke:var(--muted);stroke-width:1.5; }
  .defrost .core-frame { stroke:color-mix(in srgb,#bcecff 75%,var(--primary-text-color,#deedf5));stroke-width:2;filter:drop-shadow(0 0 1.4px #a1dfff66); }
  .defrost .fin { stroke:#d6f3ff;opacity:.3; }
  .closed-channel { fill:none;stroke:var(--muted);stroke-width:5;stroke-dasharray:2 5;opacity:.24; }
  .gate-seat { fill:none;stroke:var(--ha-card-background,var(--card-background-color,#14232d));stroke-width:8;stroke-linecap:round; }
  .gate-bar { fill:none;stroke:var(--muted);stroke-width:3;stroke-linecap:round; }
  .melt-drop { fill:color-mix(in srgb,#74c6ee 65%,var(--primary-text-color,#deedf5));stroke:color-mix(in srgb,#c9efff 50%,var(--primary-text-color,#deedf5));stroke-width:.8;animation:melt-drop 4.4s ease-in infinite; }
  .air-route.no-flow { opacity:.25;stroke-dasharray:5 5; }
  .heater-symbol rect { fill:var(--ha-card-background,var(--card-background-color,#15232d));stroke:var(--muted);stroke-width:1.2; }
  .heater-symbol path { fill:none;stroke:var(--muted);stroke-width:1.8;stroke-linejoin:round; }
  .heater-symbol text { fill:var(--muted);font-size:14px; }
  .heater-symbol.active rect { fill:#3a2e22;stroke:#f1b775; }
  .heater-symbol.active path { stroke:#ffd295;stroke-width:2.2; }
  .efficiency-label { position:absolute; bottom:0; text-align:center; font-size:10px; color:var(--muted); line-height:1.2; height:2.4em; width:100%; }
  .efficiency-label[aria-hidden=true] { visibility:hidden; }
  .metrics { display:flex; flex:none; align-items:center; gap:7px; font-size:11px; color:var(--muted); flex-wrap:wrap; }
  .metric { min-height:24px; border-radius:8px; padding:3px 6px; background:color-mix(in srgb,var(--primary-text-color,#fff) 4%,transparent); }
  .heater-path { margin-left:auto; font-variant-numeric:tabular-nums; }
  .heater-on { color:color-mix(in srgb,#e7ad6f 50%,var(--primary-text-color,#dfebf2)); }
  .co2-high { color:var(--co2-color,#e6ae75); }
  .co2-blink { animation:attention 2s ease-in-out infinite; }
  .modes { display:grid; grid-template-columns:repeat(var(--mode-count,3),minmax(0,1fr)); gap:5px; flex:none; padding-top:7px; border-top:1px solid var(--line); }
  .mode { min-width:0; display:flex; align-items:center; justify-content:center; gap:6px; padding:5px; font-size:11px; border-radius:12px; border:1px solid transparent; color:var(--muted); }
  .mode svg { width:20px; height:20px; flex:none; }
  .mode span { overflow-wrap:anywhere; }
  .mode:hover:not(:disabled) { background:color-mix(in srgb,var(--accent) 6%,transparent); }
  .mode[aria-pressed=true],.profile-chip[data-running=true] { color:var(--primary-text-color,#dfebf2);font-weight:700;background:color-mix(in srgb,#20cbb0 18%,transparent);border-color:color-mix(in srgb,#20cbb0 65%,var(--primary-text-color,#dfebf2)); }
  .mode[aria-pressed=true] svg,.profile-chip[data-running=true] svg { color:var(--accent);stroke-width:2; }
  .mode[aria-pressed=true][data-profile=boost],.mode[aria-pressed=true][data-profile=fireplace],.profile-chip[data-running=true][data-profile=boost],.profile-chip[data-running=true][data-profile=fireplace] { background:color-mix(in srgb,#ffb347 18%,transparent);border-color:color-mix(in srgb,#ffb347 65%,var(--primary-text-color,#dfebf2)); }
  [data-profile=boost] svg,[data-profile=fireplace] svg { --accent:color-mix(in srgb,#ffb347 55%,var(--primary-text-color,#dfebf2)); }
  .footer { flex:none; min-height:44px; display:flex; align-items:center; gap:8px; text-align:left; padding:8px 10px; border-radius:12px; background:color-mix(in srgb,var(--primary-text-color,#fff) 4%,transparent); width:100%; font-size:11px; }
  .footer svg { width:17px; height:17px; flex:none; color:var(--accent); }
  .footer .energy-value { font-weight:600; font-variant-numeric:tabular-nums;white-space:nowrap; }
  .footer .footer-text { color:var(--muted);flex:1;min-width:0; }
  .notice-dot { width:6px; height:6px; border-radius:50%; background:#e7ad6f; flex:none; }
  .arrow { margin-left:auto; color:var(--muted); }
  .compact { padding:8px; gap:4px; }
  .compact .air-quality,.compact .supply-chain { font-size:9.5px;margin-top:2px;gap:0; }
  .compact .description,.compact .efficiency-label,.compact .air-helper { display:none; }
  .compact .metrics { font-size:9px;gap:4px;flex-wrap:nowrap; }
  .compact .metric { min-height:20px;padding:2px 4px;white-space:nowrap; }
  .compact .heater-path { font-size:9px; }
  .compact .scene { flex-basis:108px; }
  .compact .eyebrow { font-size:9px; } .compact h2 { font-size:13px; }
  .compact .top { min-height:36px; }
  .compact .profile-chip { min-height:44px; padding:0 9px; font-size:11px; }
  .compact .air-value { font-size:clamp(18px,calc(var(--value-scale,1) * 7cqw),24px); }
  .compact .air-label { font-size:11px; }
  .compact .air { padding:0;gap:0; }
  .dense .air-helper { display:none; }
  .dense:not(.compact) { gap:6px; }
  .dense:not(.compact) .air { padding:0;gap:0; }
  .dense:not(.compact) .air-quality,.dense:not(.compact) .supply-chain { font-size:10px;margin-top:2px;gap:0; }
  .dense:not(.compact) .air-value { font-size:clamp(22px,calc(var(--value-scale,1) * 6.5cqw),28px); }
  .compact .footer { display:none; }
  .compact .modes { padding-top:4px; }
  .compact .core-svg { max-height:145px; }
  .tiny .scene,.tiny .footer { display:none; }
  .many .mode { flex-direction:column; gap:2px; }
  .error-inline { color:#e6ae75; font-size:11px; margin:0; }
  dialog { color:var(--primary-text-color,#dfebf2); background:var(--ha-card-background,var(--card-background-color,#12212b)); border:1px solid var(--line); border-radius:24px; width:min(680px,calc(100vw - 24px)); max-height:calc(100dvh - 32px); padding:0; box-shadow:0 20px 100px #0006; }
  dialog::backdrop { background:#0008;backdrop-filter:blur(5px); }
  .dialog-header { display:flex;align-items:center;justify-content:space-between;padding:12px 20px;border-bottom:1px solid var(--line); }
  .dialog-header h2 { font-size:18px; }
  .close { width:44px; border-radius:50%; font-size:25px; }
  .dialog-body { padding:20px; }
  .tabs { display:flex;gap:5px;padding:0 16px;border-bottom:1px solid var(--line); }
  .tabs button { border-bottom:2px solid transparent; font-size:12px; flex:1; }
  .tabs button[aria-selected=true] { border-bottom-color:var(--accent);color:var(--accent); }
  .stat-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:20px; }
  .stat { padding:12px;border-radius:12px;background:color-mix(in srgb,var(--primary-text-color,#fff) 4%,transparent); }
  .stat small { display:block;color:var(--muted);font-size:10px;margin-bottom:5px; }
  .stat b { font-size:21px;font-weight:500;font-variant-numeric:tabular-nums; }
  h3 { font-size:13px;font-weight:600;margin:22px 0 10px; }
  .note { color:var(--muted);font-size:12px;line-height:1.6; }
  .chart { width:100%;height:auto;display:block; }
  .chart-grid { stroke:var(--line);stroke-width:1; }
  .chart text { fill:var(--muted);font-size:10px; }
  .legend { display:flex;gap:10px;flex-wrap:wrap;font-size:10px;color:var(--muted);margin:7px 0; }
  .legend span::before { content:'';display:inline-block;width:6px;height:6px;margin-right:4px;border-radius:50%;background:var(--swatch); }
  .state-band { display:flex;height:9px;gap:1px;border-radius:3px;overflow:hidden; }
  .state-band span { flex:1;background:var(--state-color); }
  .timeline-label { margin:8px 0 4px;font-size:10px;color:var(--muted); }
  .hour-band { display:flex;gap:1px; }
  .hour-band span { flex:1;min-width:0;text-align:center;font-size:9px;line-height:22px;background:color-mix(in srgb,var(--primary-text-color,#fff) 4%,transparent); }
  .day-bars { display:grid;grid-template-columns:repeat(7,1fr);gap:9px;align-items:end;height:115px;padding-top:20px; }
  .day { display:flex;flex-direction:column;align-items:center;height:100%;gap:5px;justify-content:flex-end;font-size:10px;color:var(--muted); }
  .day .bar { width:100%;max-width:35px;min-height:2px;border-radius:5px 5px 2px 2px;background:color-mix(in srgb,var(--accent) 35%,transparent); }
  .day:last-child .bar { background:var(--accent); }
  .insight { border:1px solid var(--line);border-radius:14px;padding:15px;margin:10px 0; }
  .insight.notice { border-left:3px solid #e7ad6f; }
  .insight h3 { margin:0 0 8px; }
  .insight p { font-size:12px;line-height:1.65;margin:7px 0; }
  .insight .limitation { color:var(--muted);font-size:11px; }
  a { color:var(--accent);font-size:12px; }
  .control-row { display:flex;align-items:center;justify-content:space-between;gap:12px;margin:12px 0;flex-wrap:wrap; }
  .control-row label { font-size:12px;color:var(--muted); }
  select,input { background:var(--ha-card-background,var(--card-background-color,#12212b));border:1px solid var(--line);padding:10px;border-radius:10px;min-height:44px;max-width:100%; }
  input[type=number] { width:90px; }
  .action { padding:8px 14px;border:1px solid var(--line);border-radius:10px;font-size:12px; }
  .status-box { padding:12px;border-radius:12px;background:color-mix(in srgb,var(--accent) 5%,transparent);font-size:12px;line-height:1.7; }
  table { width:100%;border-collapse:collapse;font-size:11px; }
  th,td { padding:8px 4px;text-align:right;border-bottom:1px solid var(--line); } th:first-child,td:first-child { text-align:left; }
  summary { cursor:pointer;font-size:12px;min-height:44px;display:flex;align-items:center; }
  .table-scroll { overflow-x:auto; }
  @container (max-width:360px) { .surface:not(.compact) { padding:13px;gap:8px; } .many .modes { grid-template-columns:repeat(3,minmax(0,1fr)); } .mode { font-size:10px;gap:4px; } .profile-chip { max-width:135px; } .air-helper { display:none; } }
  @keyframes airflow { to { stroke-dashoffset:-60; } }
  @keyframes attention { 50% { opacity:.55; } }
  @keyframes melt-drop { 0%,15% { opacity:0;transform:translateY(-3px) scale(.4); } 35% { opacity:1;transform:translateY(0) scale(1); } 85%,100% { opacity:0;transform:translateY(19px) scale(.75); } }
  @media (prefers-reduced-motion:reduce) { *,*::before,*::after { animation:none !important;transition:none !important; } }
`;
