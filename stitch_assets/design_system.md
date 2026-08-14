---
name: Cognitive Discovery System
colors:
  surface: '#fcf8ff'
  surface-dim: '#dcd8e5'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2ff'
  surface-container: '#f0ecf9'
  surface-container-high: '#eae6f4'
  surface-container-highest: '#e4e1ee'
  on-surface: '#1b1b24'
  on-surface-variant: '#464555'
  inverse-surface: '#302f39'
  inverse-on-surface: '#f3effc'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#5f5e5f'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfe0'
  on-secondary-container: '#636263'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#e5e2e3'
  secondary-fixed-dim: '#c8c6c7'
  on-secondary-fixed: '#1b1b1c'
  on-secondary-fixed-variant: '#474647'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#fcf8ff'
  on-background: '#1b1b24'
  surface-variant: '#e4e1ee'
typography:
  hero-lg:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '800'
    lineHeight: 72px
    letterSpacing: -0.02em
  hero-lg-mobile:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 42px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.01em
  headline-md-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  section-gap: 120px
---

## Brand & Style

The design system is centered on a premium, discovery-oriented educational experience. It balances high-end intellectual rigor with a playful, human touch. The aesthetic is **Visual-Minimalist**: it leverages generous whitespace to reduce cognitive load while using vibrant geometric accents to signpost different learning domains. 

The goal is to evoke a sense of clarity and "aha!" moments. The UI stays out of the way of the content, acting as a sophisticated gallery for interactive puzzles and cognitive challenges. It avoids the cluttered, gamified tropes of traditional EdTech in favor of a clean, structured environment that respects the learner’s focus.

## Colors

The color palette is anchored by a warm, paper-like neutral (`#FCFBF9`) to prevent eye strain during long learning sessions. Deep Charcoal is used for maximum legibility and a sense of authority. 

Vibrant Indigo serves as the primary brand action color. A secondary semantic palette is used specifically for cognitive categorisation:
- **Logic**: Indigo (Stability and structure)
- **Problem Solving**: Blue (Clarity and fluidity)
- **Design**: Coral (Creativity and warmth)
- **Communication**: Emerald (Growth and connection)

Use these category colors for progress bars, subject tags, and decorative accents within specific course tracks.

## Typography

This design system utilizes **Inter** for all roles to achieve a precise, geometric, and modern feel. The typographic hierarchy is intentionally dramatic to create clear entry points for information.

- **Hero & Headlines**: Use heavy weights (700-800) with slight negative letter-spacing to create a "locked-in" professional look.
- **Body**: The standard 18px body size ensures high readability for complex educational concepts. 
- **Labels**: Small caps are used for metadata like "Difficulty Level" or "Estimated Time" to distinguish them from instructional text.

## Layout & Spacing

The layout philosophy is **Fixed-Fluid**: content is contained within a 1200px max-width wrapper on desktop to ensure optimal line lengths for reading, while margins scale fluidly on smaller screens.

A strict 8px grid governs all spatial relationships. Section gaps are intentionally large (up to 120px) to provide the "generous whitespace" required for a premium, calm learning atmosphere.

- **Desktop**: 12-column grid, 24px gutters.
- **Tablet**: 8-column grid, 24px gutters.
- **Mobile**: 4-column grid, 20px gutters. Content should stack vertically with center-aligned headings.

## Elevation & Depth

To maintain a minimalist aesthetic while retaining a sense of tactility, this design system uses **Tonal Layers** combined with **Ambient Shadows**.

- **Level 0 (Base)**: Warm white background.
- **Level 1 (Cards)**: White surface with a 1px border (#E5E7EB) and a very soft, diffused shadow (0px 4px 20px rgba(0,0,0,0.04)).
- **Level 2 (Interactive/Hover)**: Increased shadow spread and a slight lift (Y-axis offset) to indicate clickability.
- **Game Containers**: Use a distinct inner-shadow or a slightly darker background tint to "sink" the interactive game area into the page, creating a "portal" effect.

## Shapes

The shape language is friendly and approachable. We use progressive rounding based on the size of the container:

- **Interactive Elements (Buttons/Inputs)**: 16px radius for a soft, modern touch.
- **Content Blocks (Cards/Modules)**: 24px radius to soften the layout.
- **Major Regions (Game Containers/Hero Sections)**: 32px radius to define the most important areas of discovery.

Icons should follow this logic, using a 2px stroke width and rounded terminals to match the typography and container corners.

## Components

### Buttons
- **Primary**: Solid Vibrant Indigo with white text. 16px radius. Large padding (16px top/bottom, 32px left/right).
- **Secondary**: Ghost style with 1px Deep Charcoal border.
- **Domain-Specific**: Buttons within a "Design" course may adopt the Coral accent color for primary actions.

### Cards
- Large 24px radius.
- 1px neutral border. 
- Content should be heavily inset (32px padding) to maintain the minimalist feel.

### Input Fields
- 16px radius.
- Background should be a subtle grey-tint or white.
- Focused state uses a 2px Indigo ring.

### Game Containers
- These are the centerpiece. Use a 32px radius.
- Must have a subtle background contrast (e.g., a very light grey or the domain's tint at 5% opacity) to separate the "play" area from the "instructional" area.

### Progress Indicators
- Use thick, rounded bars (8px height) with the category-specific color to show mastery.