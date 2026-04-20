# Design System Document: Technical Precision & The Digital Curator

## 1. Overview & Creative North Star: "The Digital Curator"
The inventory management of high-end, second-hand technology requires more than just a database; it requires an aesthetic of **Technical Curation**. This design system moves away from the "cluttered warehouse" look of traditional ERPs and toward a "high-end laboratory" aesthetic.

**The Creative North Star: The Digital Curator**
We treat every laptop in the system like a precision instrument. The UI must feel like a clean-room environment—sterile but sophisticated, surgical, and authoritative. We break the standard SaaS "box-on-box" template by using **asymmetric data density**: tight, high-precision tables contrasted against expansive, breathable headers and editorial-style detail views.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
The palette is anchored by the high-energy `#00D1FF` (Electric Blue), used sparingly to denote action and "current" status, while the rest of the UI breathes through sophisticated neutrals.

### The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders for sectioning are prohibited. Layout boundaries must be defined through background color shifts or tonal transitions.
*   **Method:** Use `surface_container_low` for the page background and `surface_container_high` for a card. The contrast between these two tokens is sufficient to define the shape without "choking" the content with a line.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the hierarchy below to stack elements:
1.  **Base Layer:** `surface` (#111416)
2.  **Sectioning:** `surface_container_low` (#191c1e)
3.  **Actionable Cards:** `surface_container_highest` (#323537)
4.  **Floating Modals:** `surface_bright` (#37393c) with backdrop blur.

### Glass & Gradients
To avoid a flat "Bootstrap" feel, floating elements (like the "Quick Inspect" panel) should use `surface_variant` at 70% opacity with a `24px` backdrop blur. 
*   **Signature Texture:** Use a subtle linear gradient on primary CTAs: `primary_container` (#00d1ff) to `on_primary_container` (#00566a) at a 135-degree angle. This adds a "metallic" sheen appropriate for hardware management.

---

## 3. Typography: Editorial Authority
We use **Inter** not as a generic sans-serif, but as a Swiss-style functional typeface. 

*   **Display & Headlines:** Use `display-md` (2.75rem) for total inventory value or flagship stats. Apply a `-0.02em` letter-spacing to headlines to give them a "tighter," more premium feel.
*   **The Technical Label:** Use `label-sm` (0.6875rem) in all-caps with `0.05em` letter-spacing for metadata like Serial Numbers or SKU codes. This mimics the etched labels found on hardware.
*   **Body:** `body-md` (0.875rem) is the workhorse. It ensures high data density without sacrificing legibility during long inventory audits.

---

## 4. Elevation & Depth: Tonal Layering
We reject "drop shadows" in favor of **Ambient Luminance**.

*   **The Layering Principle:** Depth is achieved by stacking. A `surface_container_lowest` container sitting inside a `surface_container_high` area creates a "recessed" look, perfect for data entry fields.
*   **Ambient Shadows:** For elevated components (e.g., a laptop spec flyout), use a shadow with a 40px blur, 0px offset, and 6% opacity of the `on_surface` color (#e1e2e5). It should feel like a soft glow, not a heavy weight.
*   **The Ghost Border:** If a border is required for accessibility in high-density tables, use the `outline_variant` (#3c494e) at **15% opacity**. It should be felt, not seen.

---

## 5. Components: Precision Primitives

### Buttons
*   **Primary:** Gradient fill (Electric Blue), `DEFAULT` (0.25rem/8px) roundness. No border.
*   **Secondary:** `surface_container_highest` background. Text in `primary`.
*   **Tertiary:** Ghost style. No background until hover (use `surface_variant` at 30% for hover).

### Cards & Lists (The "No Divider" Rule)
*   **Inventory Lists:** Forbid the use of horizontal divider lines. Separate items using `8px` of vertical white space or by alternating background colors between `surface_container_low` and `surface_container`.
*   **Status Chips:** Use `tertiary_container` for "Refurbishing" and `primary_container` for "Ready to Sell." Chips should be pill-shaped (`full` roundness) to contrast against the `8px` system grid.

### Input Fields
*   **Style:** Modern "Bottom-Line" or "Soft-Box." Use `surface_container_highest` as the fill. 
*   **Focus State:** A 2px `primary` (#a4e6ff) glow using a `0.25rem` spread, creating a "charged" technical effect.

### Special Component: The "Spec Sheet" Flyout
For viewing laptop details, use a right-aligned drawer with a `surface_bright` background, 80% opacity, and a heavy backdrop blur. This allows the inventory list to remain visible underneath, maintaining the user's context.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use intentional asymmetry. Place a large `display-sm` stat in the top-left and leave the top-right empty to create an editorial "breathing" space.
*   **Do** use "Electric Blue" (#00D1FF) for data points that are changing in real-time (e.g., active sync).
*   **Do** align all text to a strict 4px baseline grid to maintain the "Technical Precision" aesthetic.

### Don't:
*   **Don't** use pure black (#000000). Use `surface` (#111416) to allow for depth and "on-surface" contrast.
*   **Don't** use standard "Warning" yellows. Use the `tertiary` (#ffd59c) scale for a more sophisticated, "amber" technical alert system.
*   **Don't** use 1px dividers to separate the sidebar from the main content. Use a `surface_container_low` sidebar against a `surface` main content area.

---

## 7. Roundedness Scale
| Token | Value | Use Case |
| :--- | :--- | :--- |
| `none` | 0px | Hard edges for "technical" separation |
| `sm` | 0.125rem | Micro-elements (checkboxes) |
| `DEFAULT`| 0.25rem | Standard Buttons and Inputs (8px as requested) |
| `lg` | 0.5rem | Primary Containers and Cards |
| `full` | 9999px | Status Tags and Search Bars |

---

*Document End — ETL Management Visual Guidelines*