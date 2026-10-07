# ACM BIT Mesra — Design System

The public ACM BIT Mesra site uses an editorial institutional interface: clear typography, deliberate spacing, ACM red for action and emphasis, and border-led structure instead of a collection of floating cards.

## Visual direction

The interface should feel like a serious student computing chapter, not a generic SaaS dashboard or an AI-generated template.

- **Base:** warm white in light mode and soft charcoal in dark mode.
- **Brand accent:** ACM red (#E31B23), reserved for primary actions, active navigation, important states, and small emphasis.
- **Supporting states:** emerald for open/confirmed, amber for upcoming, red for live/destructive.
- **Structure:** 1px borders, rules, lists, definition rows, and editorial columns. Avoid decorative glass, gradients, oversized shadows, and nested containers.
- **Hierarchy:** the page title starts the story. Avoid eyebrow/kicker badges above primary headings.
- **Typography:** Manrope is the primary UI/display face; JetBrains Mono is reserved for code, technical values, and measurements.

## Layout

Use the 4px/8px spacing rhythm while allowing larger editorial gaps around major sections.

- Content width: max-w-7xl for site surfaces; 65–75ch for long-form reading.
- Mobile page padding: 16px at the smallest sizes, increasing to 24px at sm.
- Desktop page padding: 32px at lg.
- Desktop layouts may split into an editorial content column and a compact facts/navigation column.
- Mobile layouts collapse to one column and preserve reading order.

## Controls

Interactive controls should generally expose at least a 44px touch target on touch devices.

- **Primary button:** ACM red, solid, high contrast.
- **Secondary button:** neutral border/background.
- **Links:** use color/weight and a simple underline or active rule for emphasis.
- **Status:** compact rounded badges are acceptable for state only; never use badges as decorative headings.
- **Icon buttons:** 44px square, consistent icon weight, visible focus ring.

## Surface patterns

Prefer one meaningful structure over many similarly styled cards.

- Event archives: ruled lists and simple event rows.
- Event detail: large editorial header, compact facts, ruled sections, disclosure-based FAQs.
- Homepage focus areas: linked rows rather than a four-card icon grid.
- Statistics: simple typographic strip with restrained dividers.
- Calls to action: one clear primary action per decision point.

## Accessibility and responsive quality

Text must remain readable in both themes, focus states must remain visible, and controls must not become cramped or horizontally overflow at narrow widths. Keyboard interaction, reduced motion, selection colors, and form control sizing are part of the shipped design rather than afterthoughts.
