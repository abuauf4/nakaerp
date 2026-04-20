# Design System Documentation: The Precision Inventory

## 1. Overview & Creative North Star
**Creative North Star: The Technical Curator**
This design system rejects the "generic SaaS" template in favor of an aesthetic that mirrors the high-end hardware it manages. We are building an experience that feels like a precision instrument—authoritative, sophisticated, and deeply intentional. 

To move beyond "standard" UI, this system utilizes **intentional asymmetry** (e.g., placing large data displays off-center to drive the eye), **overlapping editorial layers**, and **high-contrast typography scales**. We treat the screen not as a flat grid, but as a physical workspace where depth is defined by light and material rather than lines and boxes.

---

## 2. Colors & Atmospheric Depth
Our palette is rooted in the depth of midnight charcoals, punctuated by high-energy electric accents.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section content. Boundaries must be defined through background color shifts.
*   Use `surface_container_low` (#131313) for large layout sections.
*   Place `surface_container` (#1a1a1a) or `surface_container_high` (#20201f) elements on top to create definition.
*   Visible lines create "visual noise." Tonal shifts create "visual flow."

### Surface Hierarchy & Nesting
Treat the UI as a series of nested, physical layers. 
*   **Base:** `background` (#0e0e0e)
*   **Secondary Sections:** `surface_container_low` (#131313)
*   **Interactive Cards:** `surface_container` (#1a1a1a)
*   **Popovers/Floating Modals:** `surface_bright` (#2c2c2c)

### The "Glass & Gradient" Rule
To elevate the "out-of-the-box" feel:
*   **CTAs:** Use a subtle linear gradient from `primary` (#69daff) to `primary_container` (#00cffc) at a 135-degree angle.
*   **Floating Navigation:** Apply `backdrop-blur: 20px` to semi-transparent surface tokens to allow the vibrant cyan accents to "bleed" through the dark layers, creating a sophisticated "frosted glass" effect.

---

## 3. Typography: Editorial Authority
We use **Inter** as our typographic backbone. The goal is "High-Information, Low-Friction."

*   **The Hero Metric (Display LG/MD):** Use `display-lg` (3.5rem) for critical inventory numbers (e.g., total stock value). It should feel massive and confident.
*   **Technical Specs (Label MD/SM):** Use `label-md` (0.75rem) in `on_surface_variant` (#adaaaa) for laptop specifications (RAM, CPU, SKU). 
*   **Contrast as Hierarchy:** Pair a `headline-sm` title with a `label-sm` uppercase sub-label to create an "editorial" look that guides the eye through dense data without clutter.

---

## 4. Elevation & Depth: Tonal Layering
In this design system, depth is a product of light, not structure.

*   **The Layering Principle:** Instead of shadows, use "stacking." A `surface_container_highest` (#262626) card sitting on a `surface` (#0e0e0e) background provides enough contrast to feel "lifted" without a single shadow pixel.
*   **Ambient Shadows:** When a float is required (e.g., a laptop detail modal), use an ultra-diffused shadow: `box-shadow: 0 20px 40px rgba(0, 209, 255, 0.06);`. Note the cyan tint; it mimics the light emitted from our accent color.
*   **The "Ghost Border" Fallback:** If accessibility requires a container edge, use a "Ghost Border": `outline_variant` (#484847) at **15% opacity**. It should be barely felt, only seen.

---

## 5. Components
All components utilize a standard **12px (0.75rem / md)** corner radius to soften the technical density of the app.

### Buttons: The Kinetic Energy
*   **Primary:** Gradient fill (`primary` to `primary_container`). On hover, add a `0 0 15px` outer glow using `primary_dim`.
*   **Secondary:** No fill. `Ghost Border` with `primary` text.
*   **Tertiary:** `surface_container_high` background with `on_surface` text.

### Cards: The Inventory Unit
*   **Rules:** No borders. No dividers.
*   **Structure:** Use `surface_container` as the base. Use 24px (1.5rem) padding. 
*   **Interaction:** On hover, the background shifts to `surface_container_high`, and the laptop image should slightly scale (1.02x) to create a premium feel.

### Input Fields: Precision Entry
*   **Base:** `surface_container_lowest` (#000000).
*   **State:** When focused, the "Ghost Border" transforms into a `1px` solid `primary` line with a soft `2px` cyan outer glow.

### Data Lists: The Seamless Feed
*   **The Rule:** Forbid divider lines. 
*   **Execution:** Use `24px` of vertical whitespace between list items. Use a subtle background toggle (zebra striping) using `surface` and `surface_container_low` if density is extreme.

---

## 6. Do's and Don'ts

### Do
*   **Do** use `primary_fixed_dim` for "Ready to Ship" tags to provide a glowing, high-status feel.
*   **Do** embrace negative space. High data density requires "breathing room" to remain professional.
*   **Do** use `backdrop-blur` on top-level navigation to integrate the UI with the background.

### Don't
*   **Don't** use pure white (#FFFFFF) for body text; use `on_surface` for comfort and `on_surface_variant` for secondary data.
*   **Don't** use standard 1px borders. If you feel you need one, try a tonal background shift first.
*   **Don't** use sharp corners. Everything—from tooltips to checkboxes—must adhere to the `md` (12px) roundedness scale to maintain the system's "engineered softness."