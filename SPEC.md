# Vallox IV Card – Specification

> Historical v1 specification. The implemented v2 contract is documented in
> [README](README.md), [architecture](docs/ARCHITECTURE.md) and [migration](docs/MIGRATION.md).

## Overview

The Vallox IV Card is a custom Lovelace card for Home Assistant that provides a visual representation of a Vallox IV heat recovery ventilation unit's airflow, temperatures, and efficiency.

## Core Architecture

### Component Structure

```
┌─────────────────────────────────────────────────────────────┐
│                        vallox-iv-card                        │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                     ValloxIvCard                        ││
│  │  (LitElement - Custom Element)                          ││
│  │                                                         ││
│  │  Properties:                                            ││
│  │  - hass: HomeAssistant                                  ││
│  │  - _config: ValloxIvCardConfig                         ││
│  │  - _cardState: ValloxIvCardState                       ││
│  │                                                         ││
│  │  Methods:                                               ││
│  │  - setConfig(config)                                    ││
│  │  - getGridOptions()                                     ││
│  │  - static getConfigForm()                               ││
│  │  - render()                                             ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
Home Assistant State
        │
        ▼
┌───────────────────┐
│   deriveCardState │  ← Extracts and normalizes values
└───────────────────┘
        │
        ▼
┌───────────────────┐
│  ValloxIvCardState │  ← Typed internal state
└───────────────────┘
        │
        ▼
┌───────────────────┐
│   renderDiagram   │  ← SVG generation
└───────────────────┘
        │
        ▼
    SVG Output
```

## SVG Diagram Specification

### Coordinate System

- ViewBox: `0 0 800 420`
- Center point: `(400, 210)`
- Margin: 60px from edges

### Duct Layout

The diagram shows four ducts arranged in an X pattern crossing at the central heat recovery cell:

1. **Fresh Air Duct** (Blue)
   - Path: Bottom-left → Center
   - Represents: Outdoor air entering the system

2. **Supply Air Duct** (Green)
   - Path: Center → Top-right
   - Represents: Heated air going to living spaces

3. **Extract Air Duct** (Orange)
   - Path: Top-left → Center
   - Represents: Stale air from living spaces

4. **Exhaust Air Duct** (Red)
   - Path: Center → Bottom-right
   - Represents: Air expelled outside

### Heat Recovery Cell

- Position: Center of diagram
- Inner circle radius: 60px
- Efficiency ring radius: 75px
- Ring shows efficiency as arc (0-100%)

### Temperature Chips

Four chips positioned at duct endpoints:
- Outdoor: Bottom-left
- Supply: Top-right
- Extract: Top-left
- Exhaust: Bottom-right

Each chip displays:
- Temperature value with unit
- Label text

## State Handling

### Entity States

The card handles these entity states gracefully:
- **Available**: Normal display
- **Unavailable**: Shows "—" with reduced opacity
- **Unknown**: Treated as unavailable
- **Missing**: Entity not configured, element hidden

### Efficiency Normalization

The efficiency value is normalized:
- Values 0-1 are multiplied by 100
- Values are clamped to 0-100 range
- Null values show "—"

## Theme Integration

All colors use Home Assistant CSS variables:

| Element | Variable |
|---------|----------|
| Fresh duct | `--info-color` |
| Supply duct | `--success-color` |
| Extract duct | `--warning-color` |
| Exhaust duct | `--error-color` |
| Text | `--primary-text-color` |
| Labels | `--secondary-text-color` |
| Background | `--card-background-color` |
| Borders | `--divider-color` |

## Grid Options

### Standard Mode
```javascript
{
  columns: 4,
  rows: 3,
  min_columns: 2,
  min_rows: 2
}
```

### Compact Mode
```javascript
{
  columns: 2,
  rows: 2,
  min_columns: 2,
  min_rows: 2
}
```

## Editor Schema

The card uses Home Assistant's built-in selector-based editor with expandable sections:

1. **Card Settings**: Title
2. **Temperature Sensors**: Four temperature entity selectors
3. **Heat Recovery**: Efficiency, cell state, display toggles
4. **Additional Sensors**: Profile, fan speed, CO₂, humidity, post-heater
5. **Display Options**: Show/hide toggles, compact mode

## Error Handling

- Invalid config throws error → HA shows error card
- Missing hass → Shows "Loading..."
- Missing entities → Shows "—" for values
- Invalid entity IDs → Validation error

## Performance Considerations

- SVG rendering is lightweight
- State derivation only on hass/config changes
- No polling or timers
- Minimal DOM updates via Lit's efficient rendering
