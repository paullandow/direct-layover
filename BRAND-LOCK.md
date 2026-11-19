# Approved Direct Layover wordmark — locked

Approved geometry: the RIGHT EDGES OF THE STRAIGHT VERTICAL STEMS of the first d in direct and l in layover align. Do not align against the l's bottom hook. Keep the established font, weight, tracking, line spacing, lower-line indent, and period spacing.

Letter dots and punctuation dots in the clickable site wordmarks/navigation are perfect circles. The website's pool-cue animation may temporarily move the two logo dots; its reset must restore their approved circular shapes and exact positions. Do not make unrelated wordmark changes without Paul's explicit direction.

Website implementation: direct-layover-brand-geometry.js. It samples ascender stems at four-times resolution, uses one deterministic responsive alignment, and refreshes the pool-cue coordinates after alignment.

App master: direct-layover-footer.png (288 × 165). The upper line is shifted 4 source pixels to align both stems; the i dot and period are circles. All menu footers use the same asset. Keep this approved master as the source for future exports.

## Circular glyph lock

Replacement dots are allowed only in the wordmark, clickable navigation, section links, and footer control. Paragraphs, body panels, and article text keep native typography. Each replacement uses its font’s native dot dimensions, fractional em sizing, and a local baseline anchor. Do not position these dots from screen rectangles or remeasure them from animated transforms. Colon dots share one diameter and horizontal center. Animated label glyphs use the same circle geometry. Only the pool-cue effect moves the wordmark dots independently; it must restore the exact current responsive positions.
