# Vallox IV Card - Copilot Instructions

## Project Overview
Home Assistant custom Lovelace card for Vallox IV ventilation units. Built with **Lit 3** + **TypeScript**, bundled with **Vite**.

## Architecture

### File Structure Pattern
```
src/
├── card/                    # Main card implementation
│   ├── vallox-iv-card.ts    # LitElement entry point (setConfig, render, getGridOptions)
│   ├── vallox-iv-card.logic.ts   # Pure functions: HA state → ValloxIvCardState
│   ├── vallox-iv-card.svg.ts     # SVG background rendering (arrows, rings, gradients)
│   ├── vallox-iv-card.overlay.ts # HTML overlay positioned on top of SVG
│   └── vallox-iv-card.styles.ts  # CSS-in-JS styles
├── editor/                  # Visual config editor
│   ├── vallox-iv-card-editor.ts  # ha-form based editor
│   └── vallox-iv-card.schema.ts  # Form schema definition
└── shared/                  # Shared utilities
    ├── types.ts             # All TypeScript interfaces
    ├── format.ts            # Value formatting (temps, CO₂, colors)
    ├── hass.ts              # Home Assistant state helpers
    └── validation.ts        # Config validation
```

### Key Patterns

**Layered Rendering**: SVG background (`vallox-iv-card.svg.ts`) + HTML overlay (`vallox-iv-card.overlay.ts`)
- SVG handles: airflow arrows with animation, efficiency badge ring, gradients
- HTML overlay handles: all text values positioned via CSS absolute positioning
- SVG viewBox: `800×500` with center at `CX=400, CY=250`

**State Flow**: `hass` → `deriveCardState()` → `prepareRenderData()` → render
- `deriveCardState()` in `logic.ts` extracts raw values from HA entities
- `prepareRenderData()` in `svg.ts` formats values and calculates colors

**Toggle Pattern**: Display options use `boolean | undefined` where `undefined` = hidden
```typescript
postHeaterActive: boolean | undefined;  // undefined = don't show icon
```

## Development Commands
```bash
npm run dev        # Vite dev server with HMR
npm run build      # TypeScript check + Vite build → dist/vallox-iv-card.js
npm run typecheck  # TypeScript validation only
```

## Code Conventions

### Temperature Colors
5-point keyframe interpolation in `format.ts`:
- `temp_color_cold` (≤-10°C) → `temp_color_freeze` (0°C) → `temp_color_neutral` (22°C) → `temp_color_warm` (25°C) → `temp_color_hot` (≥30°C)
- Colors accept hex `#RRGGBB` or RGB array `[r, g, b]` from HA color picker

### Entity Click Support
All clickable values use callback pattern:
```typescript
onEntityClick?: (entityId: string) => void;
// Usage: fires HA "more-info" dialog
```

### CSS Variables
Card uses HA theme variables with fallbacks:
```css
--vallox-value-color: var(--primary-text-color);
--vallox-badge-fill: var(--ha-card-background);
```

### Config Defaults
Defined in `validation.ts` - always check there for default values when adding new options.

## Important Notes
- **No external CSS files** - all styles in `vallox-iv-card.styles.ts` using Lit's `css` tagged template
- **Editor uses `ha-form`** with schema-based approach for native HA look
- **Grid support**: `getGridOptions()` returns `{columns: 4, rows: 3}` for Sections view
- Output is single bundled JS file (`dist/vallox-iv-card.js`)
