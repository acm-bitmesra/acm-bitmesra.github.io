# ACM BIT Mesra — Design System Specification

This document details the visual language, design tokens, typography, component standards, and accessibility guidelines for the official ACM BIT Mesra platform.

---

## 1. Core Visual Identity

The design system merges **institutional prestige**, **academic precision**, and a **modern developer platform**. It avoids generic SaaS clichés (e.g. gratuitous glassmorphism, noisy neon gradients, AI glowing spheres).

- **Foundational Neutrals:** Deep charcoal (`#121214`), dark slate borders, clean off-white / white typography.
- **ACM Accent:** `#E31B23` (Official ACM Red, HSL `358 79% 50%`) used intentionally for primary CTAs, active states, key metrics, and branding accents.
- **Semantic Accents:**
  - Emerald (`#10B981`) for active registrations and completed milestones.
  - Amber (`#F59E0B`) for upcoming timelines and announcements.
  - Cyan / Blue (`#0077B5`) for external institutional links.

---

## 2. Spacing Scale

Strict 4px/8px baseline scale:
- `space-1`: 4px
- `space-2`: 8px
- `space-3`: 12px
- `space-4`: 16px
- `space-6`: 24px
- `space-8`: 32px
- `space-12`: 48px
- `space-16`: 64px
- `space-24`: 96px
- `space-32`: 128px

---

## 3. Border Radii

- **Inputs / Form controls:** `8px` (`rounded-md`)
- **Buttons:** `8px` (`rounded-md`)
- **Cards / Containers:** `12px – 16px` (`rounded-xl`)
- **Status Pills / Badges:** `9999px` (`rounded-full`)

---

## 4. Typography Scale

- **Display Hero:** `clamp(2.75rem, 6vw, 5rem)` — Bold, tight tracking (`tracking-tight`)
- **Section Heading:** `clamp(1.75rem, 3.5vw, 3rem)` — Semi-bold to bold
- **Card Heading:** `1.125rem – 1.5rem` (`text-lg` to `text-xl`)
- **Body Text:** `0.875rem – 1rem` (`text-sm` to `text-base`), leading relaxed (`leading-relaxed`)
- **Metadata & Monospace:** `0.75rem – 0.8125rem` (`text-xs`), JetBrains Mono / UI Monospace

---

## 5. UI Components

- **`Button`:** Accessible semantic buttons with clear hover, active, and focus rings.
- **`Badge`:** Monospace status indicator for event lifecycle (`Registration Open`, `Completed`, `Archived`).
- **`Card`:** Border-first design (`border border-border bg-card`) rather than heavy drop shadows.
- **`Navbar`:** Sticky header with backdrop blur, keyboard navigation, and mobile drawer.
- **`Footer`:** Structured 4-column institutional layout with campus coordinates.
