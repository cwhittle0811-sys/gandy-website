# Clone Website Skill

Triggered by: `/clone-website <url>`

Clone any website as a pixel-perfect replica using browser automation and parallel component construction.

---

## Core Methodology

The process operates as a **foreman-and-specialist model**: the extraction agent methodically inspects each page section, documents detailed specifications, and dispatches builder agents with complete instructions. Extraction and construction happen concurrently, with extraction work persisting as auditable artifacts in `docs/research/`.

## Key Principles

**Completeness over speed** ensures builders receive everything needed—screenshots, exact CSS values, downloaded assets, real text content, and component structures. Incomplete briefs force approximation.

**Small, focused tasks** outperform monolithic ones. Complex sections split across multiple agents (one per variant) consistently produce better results than bundling everything into a single agent prompt.

**Real content and assets** are mandatory. Text, images, videos, and SVGs extract directly from the live site, with the only exception being clearly server-generated unique content.

**Interaction model identification** must occur before building. "Is this click-driven or scroll-driven?" determines architecture entirely—getting this wrong requires complete rewrites, not CSS adjustments.

---

## Execution Phases

### Phase 1: Reconnaissance
Capture full-page screenshots, extract fonts/colors/favicons, then perform a mandatory interaction sweep—scrolling for scroll-triggered behaviors, clicking for click-driven ones, hovering for state changes—before mapping page topology.

### Phase 2: Foundation
Sequentially establish global CSS with design tokens, TypeScript interfaces, SVG icon components, and downloaded assets, verified with `npm run build`.

### Phase 3: Extraction and Dispatch
Cycle through each page section: extract via browser automation, write a specification file in `docs/research/components/`, then dispatch builder agent(s) with inline spec content and screenshots.

### Phase 4: Assembly
Wire all built sections into `src/app/page.tsx`, implementing page-level behaviors and verifying the complete build.

### Phase 5: Visual QA
Perform side-by-side comparison at multiple viewports, testing all interactions and addressing any discrepancies.

---

## Critical Extraction Patterns

Every component receives specification files documenting:
- DOM structure
- Exact computed styles from `getComputedStyle()`
- All states with before/after CSS values and transition triggers
- Verbatim text content
- Used assets
- Responsive behavior across viewports

State extraction requires clicking each tab, scrolling past triggers, and hovering elements to capture ALL visual variations—never assume the initial view tells the complete story.

Asset discovery accounts for layered compositions (background watercolor plus foreground mockup equals two images) by enumerating all `<img>` elements and background images per container.

---

## Common Failure Points

- **Wrong interaction model**: Building click-based tabs for scroll-driven content is the costliest mistake.
- **Missing layered images**: Leaves clones looking empty.
- **Approximating CSS values**: Using `text-lg` instead of exact computed values produces subtle wrongness.
- **Bundling unrelated sections**: Into single agents increases errors.
- **Skipping smooth scroll detection**: Missing `Lenis`, Locomotive Scroll, etc. makes the clone feel noticeably different.

---

## Output Structure

```
src/
  app/          # Next.js routes
  components/   # React components and extracted SVG icons
public/         # Downloaded media assets
docs/research/  # Component specifications and design analysis
  components/   # Per-section spec files
```

The methodology prioritizes auditable extraction artifacts, incremental verified builds, and exhaustive state capture over speed, ensuring clones are functionally and visually indistinguishable from originals.
