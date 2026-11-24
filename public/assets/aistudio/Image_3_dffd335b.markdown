---
name: Clarity Workspace
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#464555'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#684000'
  on-tertiary: '#ffffff'
  tertiary-container: '#885500'
  on-tertiary-container: '#ffd4a4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.125rem
    letterSpacing: 0em
  label-lg:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: '500'
    lineHeight: 0.875rem
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system embodies calm velocity, intentional clarity, and effortless execution. Designed for focused knowledge workers, developers, and product creators, it rejects noisy clutter in favor of an airy, high-utility workspace where micro-interactions acknowledge productivity without interrupting flow.

The aesthetic fuses modern Scandinavian minimalism with functional precision. It balances generous negative space, crisp border delineation, and subtle ambient light to construct an environment that feels responsive, reliable, and distraction-free. Visual hierarchies prioritize rapid scanning and keyboard-first accessibility, elevating everyday task management into an orderly, structured experience.

## Colors

The palette establishes an intentional cadence of neutral surfaces accented by clear, purposeful semantic signposts.

- **Primary Canvas & Neutral Tones:** Base canvas surfaces rest on `#F8FAFC`, with layered panels and card elevations elevated onto pure `#FFFFFF`. Subtle framing borders utilize `#E2E8F0` to maintain definition without drawing focal weight away from task labels. Deep slate text (`#0F172A` for primary headlines, `#475569` for body copy, `#94A3B8` for placeholders and inactive icons) maintains high contrast and readability.
- **Brand Accent:** `#4F46E5` serves as the primary focal tone for active state indicators, primary action triggers, active tabs, and primary controls.
- **Task Semantics:** 
  - **Completed / Resolved:** Emerald (`#10B981`) paired with soft emerald surface tints (`#ECFDF5`) highlights finished states and success toasts.
  - **In Progress / Pending:** Amber (`#F59E0B`) with muted amber surfaces (`#FFFBEB`) identifies intermediate statuses and urgent tags.
  - **Destructive / High-Priority Overdue:** Rose (`#EF4444`) with soft rose fills (`#FEF2F2`) is strictly reserved for task deletion, critical warnings, and overdue indicators.

## Typography

The type system is powered by Inter across all levels to optimize scanning efficiency, clear legibility across micro-screens, and geometric alignment.

- **Weight Tiers:** Regular (400) anchors running task notes and metadata descriptions; Medium (500) sets tags, chips, and metadata badges; Semi-Bold (600) governs interactive labels, field headers, and card titles; Bold (700) is reserved for view-level headings and analytics totals.
- **Kerning & Tracking:** Display titles apply negative letter spacing (`-0.03em` to `-0.015em`) for a modern, compact editorial feel. Small labels (`label-md`, `label-sm`) use slight positive tracking (`+0.01em` to `+0.03em`) to enhance quick legibility inside compact chips.
- **Task Styling:** Completed task items shift to `line-through`, lowering opacity to 50% and changing color from slate-900 to slate-400.

## Layout & Spacing

The layout model is anchored on an 8-point baseline grid with a 4-point sub-grid for internal component padding, pill tags, and icon alignment.

- **Desktop Framework (1024px+):** Centered workspace container capped at `1120px` width. Sidebar navigation (or utility panel) spans 280px fixed width, with the primary task area occupying the fluid remaining space. Primary list views employ `1.5rem` (`gutter`) gaps between card sections and `2rem` (`margin`) outer offsets.
- **Tablet Layout (768px – 1023px):** Adapts into a streamlined single-column container with the status bar, tab navigation, and task inputs stacked vertically, bounded by `1.5rem` edge margins.
- **Mobile Handsets (<768px):** Collapses to full-bleed with `1rem` margins and `1rem` gutters. Task creation forms dock smoothly above the bottom safe area or sticky footer bar for fluid thumb-reach interaction.
- **Vertical Rhythm:** Task row items inside list containers maintain uniform vertical offsets of `0.75rem` (`12px`) to ensure distinct visual separation without fragmenting cohesive list blocks.

## Elevation & Depth

Visual hierarchy uses clean surface contrast, crisp structural lines, and ultra-soft, tinted ambient shadows that prevent visual fatigue.

- **Base Layer (Level 0):** Background canvas in `#F8FAFC`. Completely flat with no shadows.
- **Surface Layer (Level 1 - Tasks, Input Containers):** Pure `#FFFFFF` surfaces bounded by a crisp 1px border (`#E2E8F0`) and supported by a feather-weight ambient shadow:
  `box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`.
- **Raised Interactive Layer (Level 2 - Hovered Tasks, Popovers, Dropdowns):** Subtle upward motion (`translateY(-1px)`) accented by a broader ambient shadow:
  `box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.03)`.
- **Floating Overlays (Level 3 - Modals, Dialogs, Context Drawers):** Elevated container with high-profile diffuse shadow and 1px border reinforcement:
  `box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.03)`.
- **Focus Rings:** Elements never rely on default browser outlines; interactive states utilize a crisp dual-layer ring: `box-shadow: 0 0 0 2px #FFFFFF, 0 0 0 4px #4F46E5`.

## Shapes

The design system leverages a balanced curvature tier that feels friendly yet engineered:

- **Core Elements (Inputs, Buttons, Dropdowns):** Defined by `0.5rem` (8px) corner radii, creating crisp interactive boundaries.
- **Structured Content Cards (`rounded-xl`):** Major task items, task creation forms, and metric summary boxes utilize `0.75rem` (12px) to `1rem` (16px) radii to yield friendly, contained units.
- **Container Panels (`rounded-2xl`):** Primary dashboard canvases, modal views, and parent container frames use `1rem` (16px) to `1.5rem` (24px) corner radii for clean structural nesting.
- **Badges, Status Chips, and Radios:** Pill-shaped (`9999px`) to immediately convey clickability and categorical status.

## Components

### Buttons
- **Primary:** Solid indigo fill (`#4F46E5`), white label, `0.5rem` corner radius, `space-sm` vertical by `space-md` horizontal padding. Transitions gracefully to `#4338CA` on hover.
- **Secondary / Ghost:** Transparent background with subtle border (`#E2E8F0`), slate-700 text (`#334155`), transitioning to `#F1F5F9` on hover.
- **Destructive:** Soft rose surface (`#FEF2F2`), border in `#FECDD3`, text in `#EF4444`. Hover intensifies to `#FEE2E2`.
- **Icon Actions:** 32x32px square buttons with `0.375rem` rounded corners, muted slate glyphs (`#94A3B8`), highlighting to `#0F172A` on `#F1F5F9` hover.

### Task Input Form
- Elevated white card (`#FFFFFF`) with a 1px `#E2E8F0` border and `1rem` (`rounded-xl`) radius.
- Contains an inline text field free of internal box borders, using a `0.9375rem` font size, placeholder text in `#94A3B8`, an attached category tag picker, Supabase sync status indicator, and an Indigo submit icon button.

### Checkboxes & Completion State
- **Unchecked:** 20x20px square with a `0.375rem` (6px) radius, framed by a 1.5px border (`#CBD5E1`) over white. Hover activates an Indigo tint (`#EEF2FF`).
- **Checked (Completed):** Fills instantly with Emerald (`#10B981`) and a white checkmark icon, triggering a strike-through on the parent task title and transitioning task text to `#94A3B8`.

### Chips & Status Tags
- **All / Neutral:** Pill-shaped, neutral slate fill (`#F1F5F9`), slate-600 text (`#475569`).
- **Pending:** Soft amber tint (`#FFFBEB`), border in `#FDE68A`, text in `#D97706`.
- **Completed:** Soft emerald tint (`#ECFDF5`), border in `#A7F3D0`, text in `#059669`.
- **High Priority / Overdue:** Soft rose tint (`#FEF2F2`), border in `#FECDD3`, text in `#DC2626`.

### Segmented Tabs & Filters
- Compact horizontal container with `#F1F5F9` background, `0.5rem` radius, and `0.25rem` interior padding.
- **Active Tab:** Pure white pill surface with subtle shadow (`0 1px 2px rgba(0,0,0,0.05)`), text colored `#0F172A` with Semi-Bold weight.
- **Inactive Tab:** Transparent background, text colored `#64748B`, transitioning to `#334155` on hover.

### Supabase Connection Badge
- A compact utility pill displaying sync status:
  - **Connected / Synced:** 6px pulse dot in `#10B981` accompanied by "Synced" in `label-sm` (`#059669`).
  - **Syncing / Offline:** 6px pulse dot in `#F59E0B` or `#EF4444` with responsive textual feedback.