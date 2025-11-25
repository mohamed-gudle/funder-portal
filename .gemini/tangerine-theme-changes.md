# Tangerine Theme Implementation Summary

## Overview
Successfully removed theme preferences and implemented a fixed **tangerine theme** with a **glassy background** for the funders-portal application.

## Changes Made

### 1. **Added Tangerine Theme** (`src/app/theme.css`)
- Created new `.theme-tangerine` and `.theme-tangerine-scaled` theme classes
- Used vibrant orange/coral colors with OKLCH color space:
  - Light mode: `oklch(0.65 0.19 45)` - warm tangerine orange
  - Dark mode: `oklch(0.7 0.18 40)` - slightly brighter for dark backgrounds
- Added glassy background gradient to body element

### 2. **Implemented Glassmorphism Effects** (`src/app/globals.css`)
- Added a fixed gradient background using `::before` pseudo-element
- Multi-stop gradient with various tangerine/orange shades
- Applied glassmorphism to cards with:
  - Semi-transparent backgrounds
  - 12px backdrop blur
  - Subtle borders
- Applied glassmorphism to popovers with:
  - More opaque backgrounds for better readability
  - 16px backdrop blur
  - Subtle borders
- Different styles for light and dark modes

### 3. **Set Tangerine as Default Theme** (`src/components/active-theme.tsx`)
- Changed `DEFAULT_THEME` constant from `'default'` to `'tangerine'`
- All new users will automatically get the tangerine theme

### 4. **Removed Theme Selector** (`src/components/layout/header.tsx`)
- Removed `ThemeSelector` import
- Removed `<ThemeSelector />` component from header
- Users can no longer change themes - locked to tangerine

### 5. **Updated Layout Background** (`src/app/layout.tsx`)
- Changed body className from `bg-background` to `bg-transparent`
- Allows the glassy gradient background to show through

## Visual Features

### Background
- Subtle tangerine gradient overlay
- Fixed position (doesn't scroll)
- Low opacity to not overwhelm content
- Smooth color transitions

### Glassmorphism
- **Cards**: 70% opacity (light) / 40% opacity (dark)
- **Popovers**: 85% opacity (light) / 60% opacity (dark)
- Backdrop blur for frosted glass effect
- Subtle white borders for depth

### Color Palette
The tangerine theme uses warm, inviting colors:
- Coral: `rgba(255, 127, 80, ...)`
- Orange: `rgba(255, 165, 0, ...)`
- Dark Orange: `rgba(255, 140, 0, ...)`
- Tomato: `rgba(255, 99, 71, ...)`

## Files Modified
1. `/src/app/theme.css` - Added tangerine theme and body background
2. `/src/app/globals.css` - Added glassmorphism effects
3. `/src/components/active-theme.tsx` - Changed default theme
4. `/src/components/layout/header.tsx` - Removed theme selector
5. `/src/app/layout.tsx` - Updated body background

## Notes
- The theme selector component (`src/components/theme-selector.tsx`) still exists but is no longer used
- Users can still toggle between light/dark modes using the `ModeToggle` component
- The tangerine theme adapts to both light and dark modes
- All existing theme definitions (default, blue, green, amber, mono) remain in the CSS but are not accessible via UI
