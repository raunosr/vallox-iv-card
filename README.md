# Vallox IV Card

A custom Lovelace card for Home Assistant that visualizes Vallox IV ventilation unit airflow, temperatures, and heat recovery efficiency.

![Vallox IV Card Screenshot](screenshot.png)

## Features

- 📊 **Animated Airflow Diagram** - SVG visualization with animated airflow speed controlled by fan speed
- 🌡️ **Dynamic Temperature Colors** - Automatic color coding from cold (blue) to hot (red) with smooth interpolation
- ♻️ **Heat Recovery Efficiency** - Central badge showing recovery percentage
- 🔥 **Post-Heater Indicator** - Visual icon showing post-heater status (green=active, grey=inactive)
- 🌡️ **Supply Cell Temperature** - Display temperature at the heat recovery cell output
- ⚠️ **CO₂ Alert Animation** - Pulsating warning when CO₂ exceeds configurable threshold
- 💧 **Humidity & CO₂ Display** - With custom icons
- 📱 **Sections Support** - Native grid layout for modern dashboards (4×3 or 2×2)
- 🎨 **Full Theme Integration** - Uses Home Assistant CSS variables with customizable overrides
- ⚙️ **Visual Editor** - Configure everything via UI including color pickers
- 🖱️ **Entity Click Support** - Click any value to open entity details dialog
- 🌍 **Fahrenheit Support** - Automatic conversion for temperature color calculations

## Installation

### HACS (Recommended)

1. Open HACS in Home Assistant
2. Go to "Frontend" section
3. Click the menu (three dots) and select "Custom repositories"
4. Add this repository URL with category "Lovelace"
5. Install "Vallox IV Card"
6. Refresh your browser

### Manual Installation

1. Download `vallox-iv-card.js` from the [latest release](releases)
2. Copy to `/config/www/vallox-iv-card.js`
3. Add resource in Home Assistant:
   - Go to Settings → Dashboards → Resources
   - Add `/local/vallox-iv-card.js` as JavaScript Module

## Configuration

### Using UI Editor

1. Add a new card to your dashboard
2. Search for "Vallox IV Card"
3. Configure entities using the visual editor with grouped sections

### YAML Configuration

```yaml
type: custom:vallox-iv-card
title: Ventilation

# Temperature sensors
outdoor_air_temp: sensor.vallox_outdoor_air
supply_air_temp: sensor.vallox_supply_air
supply_cell_temp: sensor.vallox_supply_cell_air
extract_air_temp: sensor.vallox_extract_air
exhaust_air_temp: sensor.vallox_exhaust_air

# Heat recovery
efficiency: sensor.vallox_efficiency
cell_state: sensor.vallox_cell_state
post_heater: binary_sensor.vallox_post_heater

# Additional sensors
profile: sensor.vallox_profile
fan_speed: sensor.vallox_fan_speed
co2: sensor.vallox_co2
humidity: sensor.vallox_humidity

# Display toggles
show_efficiency: true
show_profile: true
show_fan_speed: true
show_cell_state: true
show_co2: true
show_humidity: true
show_supply_cell_temp: true
show_post_heater: true

# Temperature colors (optional - has smart defaults)
enable_temp_colors: true
temp_color_cold: "#0000FF"      # ≤-10°C
temp_color_freeze: "#00FFFF"    # 0°C
temp_color_neutral: "#8892E3"   # 22°C
temp_color_warm: "#FFA500"      # 25°C
temp_color_hot: "#FF4500"       # ≥30°C

# CO₂ alert settings
co2_limit: 1000
co2_alert_color: "#ff4444"
enable_co2_blink: true

# Typography (optional)
value_font_size: 48
font_weight: 500
unit_opacity: 0.6

# Custom labels (optional)
label_cell_state_title: "LTO-Cell State"
label_extract_air: "Extract air"
label_supply_air: "Supply air"
label_outdoor_air: "Outdoor air"
label_exhaust_air: "Exhaust air"
```

## Configuration Options

### Entity Configuration

| Option | Type | Description |
|--------|------|-------------|
| `title` | string | Card title |
| `outdoor_air_temp` | entity | Outside air temperature sensor |
| `supply_air_temp` | entity | Supply air to rooms temperature sensor |
| `supply_cell_temp` | entity | Temperature after heat exchanger (before post-heater) |
| `extract_air_temp` | entity | Extract air from rooms temperature sensor |
| `exhaust_air_temp` | entity | Exhaust air going outside temperature sensor |
| `efficiency` | entity | Heat recovery efficiency sensor (%) |
| `cell_state` | entity | Heat cell state (heat_recovery, cool_recovery, bypass, defrost) |
| `post_heater` | entity | Post-heater state (binary_sensor, sensor, or switch) |
| `profile` | entity | Ventilation profile (home, away, boost, fireplace, extra) |
| `fan_speed` | entity | Fan speed sensor (0-100%, controls animation speed) |
| `co2` | entity | CO₂ sensor (ppm) |
| `humidity` | entity | Humidity sensor (%) |

### Display Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `show_efficiency` | boolean | `true` | Show efficiency badge in center |
| `show_profile` | boolean | `true` | Show ventilation profile |
| `show_fan_speed` | boolean | `true` | Show fan speed value |
| `show_cell_state` | boolean | `true` | Show cell state header |
| `show_co2` | boolean | `true` | Show CO₂ value |
| `show_humidity` | boolean | `true` | Show humidity value |
| `show_supply_cell_temp` | boolean | `true` | Show supply cell temperature on arrow |
| `show_post_heater` | boolean | `true` | Show post-heater indicator icon |

### Temperature Color Options

Dynamic temperature colors with linear interpolation between 5 keyframes:

| Option | Type | Default | Temperature Zone |
|--------|------|---------|------------------|
| `enable_temp_colors` | boolean | `true` | Enable dynamic coloring |
| `temp_color_cold` | color | `#0000FF` | ≤-10°C (Deep Blue) |
| `temp_color_freeze` | color | `#00FFFF` | 0°C (Cyan) |
| `temp_color_neutral` | color | `#8892E3` | 22°C (Lavender) |
| `temp_color_warm` | color | `#FFA500` | 25°C (Orange) |
| `temp_color_hot` | color | `#FF4500` | ≥30°C (OrangeRed) |

Colors accept hex strings (`#RRGGBB`) or RGB arrays (`[r, g, b]`) from HA color picker.

### CO₂ Alert Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `co2_limit` | number | `1000` | CO₂ threshold (ppm) that triggers alert |
| `co2_alert_color` | string | `#ff4444` | Color when CO₂ exceeds threshold |
| `enable_co2_blink` | boolean | `true` | Enable pulsating animation for alert |

### Typography Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `value_font_size` | number | `48` | Base font size for values (SVG units) |
| `font_weight` | number | `500` | Font weight for values |
| `unit_opacity` | number | `0.6` | Opacity for unit text (°C, %, ppm) |

### Label Customization

| Option | Type | Default |
|--------|------|---------|
| `label_cell_state_title` | string | `"LTO-Cell State"` |
| `label_extract_air` | string | `"Extract air"` |
| `label_supply_air` | string | `"Supply air"` |
| `label_outdoor_air` | string | `"Outdoor air"` |
| `label_exhaust_air` | string | `"Exhaust air"` |
| `label_efficiency` | string | `"Efficiency"` |
| `label_profile` | string | `"Profile"` |
| `label_fan_speed` | string | `"Fan speed"` |
| `label_humidity` | string | `"Humidity"` |
| `label_co2` | string | `"CO₂"` |

## Theming with CSS Variables

Customize the card appearance using CSS variables:

```css
ha-card {
  --vallox-value-color: var(--primary-text-color);
  --vallox-label-color: var(--secondary-text-color);
  --vallox-unit-opacity: 0.6;
  --vallox-glow-start: #e1f0ff;
  --vallox-ring-stroke: #dcdcdc;
  --vallox-ring-stroke-inner: #e6e6e6;
  --vallox-arrow-dark: #2a7ebf;
  --vallox-arrow-light: #5cb8ff;
  --vallox-badge-stroke: var(--divider-color, #d1e8ff);
  --vallox-badge-fill: var(--ha-card-background);
  --vallox-line-color: #d1e8ff;
}
```

## Airflow Diagram

The card displays a visual diagram showing:

```
  Extract (from rooms)          Outdoor (fresh air)
         ↘                           ↙
          ┌─────────────────────────┐
          │                         │
          │    [Heat Recovery]      │
          │      Efficiency %       │
          │                         │
          └─────────────────────────┘
         ↙  🔥 17.1°C               ↘
  Supply (to rooms)            Exhaust (expelled)
```

- **Dark blue arrow**: Extract air from rooms → Exhaust (animated)
- **Light blue arrow**: Outdoor fresh air → Supply air (animated)
- **Animation speed**: Controlled by `fan_speed` entity value (0-100%)
- **Efficiency badge**: Heat recovery percentage in center
- **Post-heater icon**: Radiator icon on supply path (green=active, grey=inactive)
- **Supply Cell Temp**: Temperature badge after heat recovery cell

## Sections View

The card supports Home Assistant's Sections view with automatic grid sizing:

- **Standard mode**: 4 columns × 3 rows
- **Minimum**: 2 columns × 2 rows

## Development

```bash
# Install dependencies
npm install

# Development server with hot reload
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck
```

## License

MIT License
