# SkillQuest Development Rules & Design System Guidelines

All future development, component creation, and styling in this workspace MUST strictly adhere to the **Stitch Cognitive Discovery Platform Design System**.

## 1. Aesthetic & Design Philosophy
- **Visual-Minimalist**: Prioritize generous whitespace (up to 120px section gaps on desktop), clean 8px spatial grid alignment, and uncluttered content cards.
- **Tonal Elevation**: 
  - Base surface: `#FCF8FF` / `#FCFBF9`
  - Cards: Level 1 (`#FFFFFF` with 1px border `#E5E7EB` or `var(--outline-variant)` and ambient shadow `0px 4px 20px rgba(0,0,0,0.04)`).
  - Hover states: Level 2 subtle lift (`transform: translateY(-2px)`) with expanded shadow.
  - Game Containers: Level 3 inner-portal effect (`border-radius: 32px` with inset portal shadow and 5% opacity domain tint).

## 2. Domain-Specific Semantic Color Taxonomy
Every cognitive domain and learning category MUST use its assigned semantic color accent for tags, progress bars, highlights, and primary actions within that domain:
- **Logic**: Indigo (`#3525CD` / `#4F46E5`)
- **Problem Solving**: Blue (`#0284C7` / `#0284C7`)
- **Design**: Coral (`#7E3000` / `#A44100` / `#E05638`)
- **Communication**: Emerald (`#059669` / `#10B981`)

## 3. Shape & Border Radius Rules
- **Interactive Elements (Buttons, Inputs, Chips)**: `16px` border-radius (`0.75rem` / `1rem`).
- **Content Cards & Modules**: `24px` border-radius (`1.5rem`).
- **Major Regions (Game Containers, Hero Banners, Modals)**: `32px` border-radius (`2rem`).

## 4. Typography Rules
- Font Family: **Inter**, sans-serif.
- **Hero Headlines**: Weight 800 (Extra Bold), letter-spacing `-0.02em`.
- **Section Titles & Headlines**: Weight 700 (Bold), letter-spacing `-0.01em`.
- **Body Text**: Standard 18px (`body-lg`) or 16px (`body-sm`) for maximum legibility.
- **Labels & Metadata**: Small caps / uppercase (`label-caps`), 14px, weight 600, letter-spacing `0.05em`.

## 5. Layout Grid
- Fixed-Fluid container with `1200px` max-width desktop wrapper.
- Desktop: 12 columns, 24px gutters, 64px outer margins.
- Mobile: 4 columns, 20px outer margins. Vertical stack.
