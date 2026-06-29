# CLAUDE.md — marked-bridge

## What is this?

A standalone npm package (`marked-bridge`) that extends the [marked](https://marked.js.org) Markdown parser to render bridge hands, deals, and auctions. Framework-agnostic — produces plain HTML with CSS classes.

Extracted from the Bridge Forge platform (`~/dev/CODE/bridge-forge`). The full spec is at `bridge-forge/docs/developer/bridge Doc Integration/MARKED_BRIDGE_SPEC.md`.

## Project Structure

```
bridge-marked/
├── src/
│   ├── index.ts       Entry point — bridgeExtension() for marked.use()
│   ├── parser.ts      Parses fenced block bodies into typed data
│   ├── renderer.ts    Renders parsed data to HTML strings
│   ├── types.ts       TypeScript interfaces
│   └── style.css      Default stylesheet (CSS custom properties for theming)
├── demo/
│   ├── index.html     Live demo — textarea + preview, no build step
│   └── example.md     Sample markdown with all block types
├── dist/              Built output (gitignored)
├── package.json
├── tsconfig.json
└── README.md
```

## Commands

```bash
npm install            # Install dependencies
npm run build          # Compile TypeScript + copy CSS to dist/
npm run dev            # Serve demo on port 3333
npm run typecheck      # Type check without emitting
```

## Current State

- Parser covers all 6 block types: hand, hands, deal, auction, bidding, pairbidding
- Renderer produces self-contained HTML with bridge-* CSS classes
- Demo works standalone from CDN (marked loaded from jsdelivr)
- Demo has its own inline parser/renderer (duplicated from src/) because the package isn't built for browser yet

## Next Steps

1. **Build for browser** — bundle src/ into a single ES module that can be imported from CDN or `<script type="module">`
2. **Tests** — unit tests for parser (round-trip) and renderer (snapshot HTML)
3. **Publish to npm** — `npm publish` as `marked-bridge`
4. **Demo uses built package** — replace the inline JS in demo/index.html with an import of the built dist/
5. **2-colour mode** — respect `suitColours: '2-colour'` option (black/red instead of 4-colour)
6. **Dark mode** — CSS custom properties already support it, just needs documented presets

## Key Design Decisions

- **No framework dependency** — output is plain HTML + CSS. Works with any renderer.
- **Fenced code blocks** — uses standard ` ```hand ` / ` ```deal ` / ` ```auction ` fence names. Unknown renderers show raw text as a code block (graceful degradation).
- **PBN card notation** — `Spades.Hearts.Diamonds.Clubs` dot-separated. Industry standard.
- **CSS custom properties** — all colours overridable via `--bridge-*` variables.
- **Parser accepts legacy JSON** — fence bodies starting with `{` are parsed as JSON for backward compatibility with Bridge Forge's older format.

## Relationship to Bridge Forge

The parser and renderer here are simplified extractions from:
- `bridge-forge/src/lib/docs/bridgeBlocks.ts` (parser)
- `bridge-forge/src/lib/server/markdownHtml.ts` (server-side HTML renderer)
- `bridge-forge/src/lib/components/docs/md/display/*.svelte` (Svelte display components — NOT extracted, these are framework-specific)

Bridge Forge will eventually import `marked-bridge` as a dependency instead of maintaining its own copy.
