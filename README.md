# marked-bridge

A lightweight `marked` extension for rendering bridge hands, deals, auctions, and partnership bidding directly in Markdown.

Built from BridgeForge bridge rendering code, it parses fenced bridge blocks and renders them as styled embedded SVG graphics for crisp, scalable output.

## Table of Contents

- [Features](#features)
- [Install](#install)
- [Usage](#usage)
- [Live Demo](#live-demo)
- [Supported Blocks](#supported-blocks)
- [Card Notation](#card-notation)
- [Styling](#styling)
- [API](#api)
- [License](#license)

## Features

- Renders bridge blocks as **embedded SVG**
- Supports `hand`, `hands`, `deal`, `auction`, `bidding`, and `pairbidding`
- Supports full deal compass layout plus NS/EW pair views
- Supports auction tables, annotations, and continuation bids
- Works as a `marked` renderer extension or via direct parser/renderer API
- Ships with a default stylesheet and themeable CSS variables

## Install

```bash
npm install marked marked-bridge
```

> `marked-bridge` requires `marked` `>=9.0.0` as a peer dependency.

## Usage

```javascript
import { marked } from 'marked';
import { bridgeExtension } from 'marked-bridge';
import 'marked-bridge/style.css';

marked.use(bridgeExtension());

const html = marked.parse(`
```hand
North: AKQ.432.876.J543
```
`);
```

## Live Demo

Run the demo locally:

```bash
npm run dev
```

Then open the URL shown in the terminal (default `http://localhost:3333`).

## Supported Blocks

### `hand`

Render a single hand with optional label.

```markdown
```hand
North: AKQ.432.876.J543
```
```

### `hands`

Render multiple hands with optional title and row count.

```markdown
```hands
title: Opening Leads
perRow: 3
West: KQ2.J876.A3.9754
North: AJ9.AK5.QT2.KQJ3
East: T8765.43.K987.86
```
```

### `deal`

Render a full deal with four hands and optional bidding.

```markdown
```deal
label: Example deal
board: 3
N: AKQ.432.876.J543
E: 654.A987.QJ2.65
S: J987.KQJ.543.987
W: 32.65.AK9.AKQT2
1NT pass 3NT pass
pass pass
ann: 1NT | 15-17 balanced
```
```

Supported `deal` views:

- `all` — compass layout (default)
- `ns` — vertical pair view
- `ew` — horizontal pair view

### `auction`

Render competitive auctions with annotations.

```markdown
```auction
label: Competitive auction
board: 7
1NT pass 3NT pass
pass pass
ann: 1NT | 15-17 balanced
```
```

### `bidding` / `pairbidding`

Render partnership bidding and continuation tables.

```markdown
```auction
label: Stayman
seats: NS
N: AKQ.J432.876.J54
S: J987.KQ5.A43.A98
1NT 2C
?
ann: 1NT | 15-17 balanced
ann: 2C | Stayman
next: 2D | No 4-card major
next: 2H | 4+ hearts
```
```

## Card Notation

Use PBN-style dot-separated suits: `Spades.Hearts.Diamonds.Clubs`

- Ranks: `A K Q J T 9 8 7 6 5 4 3 2`
- `T` or `10` may be used for ten
- Void suit: `AKQ..876.J543`
- Wildcard: `x`

## Styling

Import the default stylesheet:

```javascript
import 'marked-bridge/style.css';
```

Or use a `<link>` tag:

```html
<link rel="stylesheet" href="node_modules/marked-bridge/dist/style.css">
```

### Theme variables

Override colors with CSS variables:

```css
:root {
  --bridge-spade: #2563eb;
  --bridge-heart: #dc2626;
  --bridge-diamond: #ea580c;
  --bridge-club: #16a34a;
  --bridge-vul: #dc2626;
  --bridge-nonvul: #16a34a;
}
```

## API

```typescript
import { bridgeExtension, parseBridgeBlock, renderHand, renderDeal, renderAuction } from 'marked-bridge';

marked.use(bridgeExtension());

const data = parseBridgeBlock('hand', 'North: AKQ.432.876.J543');
const html = renderHand(data);
```

### Exported symbols

- `bridgeExtension(options?)`
- `parseBridgeBlock(type, raw)`
- `renderHand(data)`
- `renderHands(data)`
- `renderDeal(data)`
- `renderAuction(data)`

## Contact

Built and maintained by Stephen Turner at BridgeForge.

Email: <frawdo@bridgeforge.uk>

## License

MIT

Copyright © 2026 Stephen Turner / BridgeForge
