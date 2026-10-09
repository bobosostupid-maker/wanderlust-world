# Wanderlust World: Travel Showcase

A photographic travel guide with an Apple-inspired presentation: white, graphite, silver and a restrained blue accent. The photographs provide the color. Cinematic introductions invite discovery; clear articles and practical flight controls support trip planning.

## Visual system

- **Light:** white `#ffffff`, silver surfaces `#f5f5f7`, graphite text `#1d1d1f`, secondary text `#626267`, blue accent `#0071e3`.
- **Dark:** black `#000000`, charcoal surfaces `#161617`, text `#f5f5f7`, secondary text `#a1a1a6`, bright blue accent `#2997ff`.
- **Typography:** the platform's native system font, followed by self-hosted Outfit as a fallback. Strong display headings and comfortable article text. System fonts avoid downloading a proprietary Apple font.
- **Composition:** a spacious centered introduction, an expanding panoramic image, full-screen destination scenes, reading columns, grouped facts, horizontal photographic galleries and direct trip-planning controls.
- **Shapes:** pill actions, circular gallery controls, 8px form fields and flight rows, square photographs and 24px dialogs. Comparison cells are flat and square within the fare matrix.
- **Theme:** system preference by default. Light/Dark overrides are saved locally and applied before paint. Content sections keep one consistent theme; white text over photographs ensures readability.
- **Navigation:** a 64px borderless header with compact monochrome branding, quiet desktop links and one blue booking action. Official Phosphor sun/moon icons replace the text theme control. Below 1200px, a full-height menu uses large destination links, locks the background and supports Escape and contained keyboard focus. No-JavaScript navigation remains visible.
- **Boundaries:** section rhythm and silver surfaces replace repeated decorative rules. Form fields and fare comparisons retain useful boundaries. The header and footer have no divider lines.

The reference is Apple's pacing, typography and visual hierarchy, adapted to destination discovery. It is an independent web design, not an official Apple design system. Reference pages: [AirPods Pro](https://www.apple.com/airpods-pro/) and [iPad Pro](https://www.apple.com/ipad-pro/).

## Motion and spacing

Design variance 7, motion intensity 8, visual density 3.

- The home photograph starts directly below the measured copy, with square corners and a height determined by the available viewport. The headline has 64-88px of space below the header. Inverse image transforms preserve the photo's proportions as it expands to fill the viewport below the header.
- Four destination scenes rise into the viewport and stack during scrolling. Their photographs and text move at different speeds, adding depth. Controls jump to a chosen scene and sit above all four panels. The pinned frame uses clipping that prevents keyboard focus from scrolling its contents vertically.
- Quick Facts uses flat typography on desktop. On widths below 1024px it becomes a compact sticky strip above the history, with native horizontal browsing and a scroll-linked reading progress line. History subheadings, facts, visitor notes and related destinations enter progressively.
- Guide heroes have visible photographic parallax and a slower-moving title. Galleries move horizontally during vertical scrolling, with a second camera movement inside each image, and support previous/next controls and keyboard browsing. Pinned galleries fit their toolbar, photo and caption to the available height below the header, with no fixed photo-height cap leaving empty space.
- The opening pin uses 0.8 viewport heights of scrolling; the four-destination sequence uses 2.4. Section gaps are tightened so transitions contain useful imagery and content.
- Pinning runs only at widths of at least 1024px, heights of at least 700px, and with reduced motion disabled. Smaller viewports use normal destination sections with GSAP text reveals and photographic parallax. Mobile galleries retain native swiping while their images move with both page scrolling and horizontal browsing. The desktop gallery's vertical scroll distance is 65% of its horizontal travel, with a minimum of 1.5 viewport heights.
- Reduced motion disables entrances, parallax, pinning, animated scrolling, orbs and skeleton shimmer. Without GSAP, the content uses native layouts. Without JavaScript, navigation and documentary embeds remain available.

GSAP 3.15.0 and ScrollTrigger are vendored in `js/vendor`, with original copyright and license notices. [ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [GSAP standard license](https://gsap.com/standard-license/). Outfit's SIL Open Font License is included in `fonts/OFL.txt`.

The [Phosphor](https://github.com/phosphor-icons/core) icons are local assets with their MIT license in `image/icons/PHOSPHOR-LICENSE`.

## Loading states

- Image skeletons appear only while an image request is pending and disappear on load. A failed image stops animating and shows an unavailable state.
- Flight searches deliberately simulate a 4.8-second request in three stages: route search, cabin comparison and preparing results. An official Thinking Orb changes states alongside two shimmer skeleton rows. The search button is disabled and results are announced accessibly. Flight rows enter with a staggered GSAP reveal.
- Documentary videos load after activation. A poster gives way to an orb while the embed loads; a direct YouTube link appears if the request takes longer than 12 seconds.
- The official [Libraries.dev Thinking Orbs](https://libraries.dev/orbs) engine from `thinking-orbs@0.3.2` is vendored locally (13 KB, MIT license included). A native canvas adapter uses its original geometry and painter, tinted blue with a higher globe opacity for legibility. It pauses when hidden or offscreen and draws a still frame with reduced motion. The engine export needs no React runtime or site build step.
- Confirming a sample booking displays an Orb and itinerary skeleton for 3.6 seconds before saving locally. Closing during this step cancels the pending save. The confirmation uses a typographic itinerary, readable detail grid, reference and total; both dialogs share the same surface and GSAP entrance.
- Ready pages and cached images do not receive artificial full-page loading screens. Flight records and bookings remain explicitly labeled as a static demonstration.

## Preserved structure

The six HTML URLs, primary navigation labels, logo and wordmark, destination histories, photo captions, facts, practical tips, documentary URLs, page titles and descriptions are retained. Booking field IDs, names, order, fare choices and destination query parameters remain available. `#destinations` and `#plan` are preserved. There is no route migration or hosting change.

Original photographs remain in `image`; the site uses optimized WebP copies and smaller responsive sources. The new trip-planning still-life is generated supporting imagery, not a destination photograph.

## Initial audit

The original site used Segoe UI, a teal gradient, orange and purple accents, a cream background, pill controls, rounded cards, emoji feature icons, a typing headline and automatically rotating galleries. The visual redesign replaces those competing patterns, removes automatic gallery rotation and typing, and retains the content and conversion paths.

The project remains HTML, native CSS and JavaScript, without a framework or build dependency. No analytics or structured data existed in the original checkout.
