# marked-bridge

A [marked](https://marked.js.org) extension for rendering bridge hands, deals, and auctions in Markdown.

Write bridge content in plain Markdown using fenced code blocks — `marked-bridge` renders them as formatted HTML with suit-coloured symbols, compass layouts, and vulnerability-aware auction tables.

## Quick Start

```bash
npm install marked marked-bridge
```

```javascript
import { marked } from 'marked';
import { bridgeExtension } from 'marked-bridge';
import 'marked-bridge/style.css';

marked.use(bridgeExtension());

const html = marked.parse(`
\`\`\`hand
North: AKQ.432.876.J543
\`\`\`
`);
```

## Live Demo

Open `demo/index.html` in a browser — no build step needed. Type bridge Markdown on the left, see the rendered output on the right.

```bash
npx serve demo -p 3333
```

## Block Types

### `hand` — Single Hand

```
\`\`\`hand
North: AKQ.432.876.J543
\`\`\`
```

### `hands` — Multiple Hands

```
\`\`\`hands
title: Opening Leads
perRow: 3
West: KQ2.J876.A3.9754
North: AJ9.AK5.QT2.KQJ3
East: T8765.43.K987.86
\`\`\`
```

### `deal` — Full Deal

```
\`\`\`deal
label: Example deal
board: 3
N: AKQ.432.876.J543
E: 654.A987.QJ2.65
S: J987.KQJ.543.987
W: 32.65.AK9.AKQT2
1NT pass 3NT pass
pass pass
ann: 1NT | 15-17 balanced
\`\`\`
```

Supports three views: `all` (compass), `ns` (vertical pair), `ew` (horizontal pair).

### `auction` — Competitive Auction

```
\`\`\`auction
label: Competitive auction
board: 7
1NT pass 3NT pass
pass pass
ann: 1NT | 15-17 balanced
\`\`\`
```

### Partnership Bidding

```
\`\`\`auction
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
\`\`\`
```

## Card Notation

PBN-style dot-separated suits: `Spades.Hearts.Diamonds.Clubs`

- Ranks: `A K Q J T 9 8 7 6 5 4 3 2` (T = ten, `10` also accepted)
- Void: empty segment, e.g. `AKQ..876.J543`
- Wildcard: `x` for unspecified cards

## Styling

Import the default stylesheet:

```javascript
import 'marked-bridge/style.css';
```

Or use a `<link>` tag:

```html
<link rel="stylesheet" href="node_modules/marked-bridge/dist/style.css">
```

Suit colours use CSS custom properties — override to match your theme:

```css
:root {
  --bridge-spade: #2563eb;    /* blue */
  --bridge-heart: #dc2626;    /* red */
  --bridge-diamond: #ea580c;  /* orange */
  --bridge-club: #16a34a;     /* green */
}
```

## API

```typescript
import { bridgeExtension, parseBridgeBlock, renderHand, renderDeal, renderAuction } from 'marked-bridge';

// Use as a marked extension
marked.use(bridgeExtension());

// Or use the parser/renderer directly
const data = parseBridgeBlock('hand', 'North: AKQ.432.876.J543');
const html = renderHand(data);
```

## License

MIT
