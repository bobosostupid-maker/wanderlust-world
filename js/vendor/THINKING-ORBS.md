# Thinking Orbs

`thinking-orbs.min.js` bundles the official `thinking-orbs@0.3.2/engine` export.
Its animation geometry and canvas painter are unchanged. `../orbs.js` supplies the
DOM lifecycle, blue theme tint, a higher globe opacity for contrast, visibility pausing and reduced-motion handling.
No React runtime, CDN or site build step is needed.

Source: https://github.com/Jakubantalik/Libraries.dev/tree/main/packages/thinking-orbs
Docs: https://libraries.dev/orbs
License: MIT, included in `THINKING-ORBS-LICENSE`.

To reproduce the checked-in bundle with npm packages installed in a temporary folder:

```sh
npm install --prefix /tmp/wanderlust-orbs thinking-orbs@0.3.2 esbuild@0.25.11
/tmp/wanderlust-orbs/node_modules/.bin/esbuild /tmp/wanderlust-orbs/node_modules/thinking-orbs/dist/engine.es.js --bundle --minify --format=iife --global-name=ThinkingOrbsEngine --outfile=js/vendor/thinking-orbs.min.js --banner:js='/* thinking-orbs 0.3.2 | MIT | Jakub Antalik | libraries.dev/orbs | license: THINKING-ORBS-LICENSE */'
```
