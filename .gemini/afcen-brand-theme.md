# AfCEN Brand Theme Implementation

## Overview
Successfully implemented a custom theme matching the **AfCEN (Africa Climate and Energy Nexus)** logo colors with a glassy background effect.

## Logo Color Analysis
The AfCEN logo features:
- **Coral/Orange Sunset**: Top half with warm coral tones (#F47D5F, #FF9169, #FFA078)
- **Deep Green**: Text and flowing energy lines representing growth and sustainability
- **Brand Message**: Climate and energy nexus for Africa

## Theme Colors

### Primary Colors (Deep Green)
Inspired by the AfCEN logo's green text and flowing lines:
- **Light Mode**: `oklch(0.35 0.12 155)` - Deep forest green
- **Dark Mode**: `oklch(0.45 0.14 155)` - Brighter green for visibility

### Accent Colors (Coral/Orange)
Matching the sunset in the logo:
- **Light Mode**: `oklch(0.72 0.15 45)` - Warm coral
- **Dark Mode**: `oklch(0.68 0.14 40)` - Slightly muted coral

## Background Gradients

### Body Background (`theme.css`)
Subtle coral gradient inspired by the logo's sunset:
```css
rgba(244, 125, 95, 0.12) → rgba(255, 145, 105, 0.08) → 
rgba(255, 160, 120, 0.06) → rgba(220, 140, 100, 0.08) → 
rgba(244, 125, 95, 0.10)
```

### Fixed Background Layer (`globals.css`)
Gradient transitioning from coral sunset to green undertones:
```css
Coral sunset (0-40%) → Transition (40-60%) → Green finish (60-100%)
```
This creates a visual journey from the warm sunset to the sustainable green energy theme.

## Glassmorphism Effects

### Cards
- **Light Mode**: 70% white opacity with 12px blur
- **Dark Mode**: 40% black opacity with 12px blur
- Subtle borders for depth

### Popovers
- **Light Mode**: 85% white opacity with 16px blur
- **Dark Mode**: 60% black opacity with 16px blur
- Enhanced readability with stronger backgrounds

## Brand Cohesion

The theme creates a cohesive brand experience by:
1. **Primary Actions**: Deep green (matching logo text) for buttons, links, and key interactions
2. **Accents**: Coral/orange (matching sunset) for highlights and secondary elements
3. **Background**: Subtle gradient from coral to green, representing the climate-energy nexus
4. **Glassmorphism**: Modern, premium feel that doesn't overwhelm the brand colors

## Files Modified
1. `/src/app/theme.css` - Updated tangerine theme with AfCEN colors
2. `/src/app/globals.css` - Updated background gradients to match logo

## Color Psychology
- **Green**: Sustainability, growth, energy, Africa's natural wealth
- **Coral/Orange**: Warmth, optimism, African sunset, energy transition
- **Gradient Flow**: Visual representation of the climate-energy nexus

## Accessibility
- High contrast ratios maintained for text readability
- Different shades for light/dark modes ensure visibility
- Glassmorphism opacity levels tested for content legibility

## Next Steps (Optional)
Consider adding:
- Green hover states on primary buttons
- Coral accent on active navigation items
- Subtle green tint to success messages
- Coral tint to warning/info messages
