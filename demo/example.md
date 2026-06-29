# Bridge Markdown Demo

This document demonstrates all the bridge block types supported by `marked-bridge`.

## Single Hand

```hand
North: AKQ.432.876.J543
```

## Multiple Hands

```hands
title: Opening Leads
perRow: 3
West: KQ2.J876.A3.9754
North: AJ9.AK5.QT2.KQJ3
East: T8765.43.K987.86
```

## Full Deal (Compass Layout)

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
ann: 3NT | Quantitative raise
```

## NS Pair View

This should show only North and South stacked vertically.

```deal
label: Opening lead problem
view: ns
N: AKQ.432.876.J543
S: J987.KQJ.543.987
```

## EW Pair View

This should show only East and West side by side.

```deal
label: Defensive problem
view: ew
E: 654.A987.QJ2.65
W: 32.65.AK9.AKQT2
```

## Competitive Auction (4 seats)

```auction
label: Competitive auction
board: 7
1NT pass 3NT pass
pass pass
ann: 1NT | 15-17 balanced
```

## Partnership Bidding (NS)

This should use a two-column layout for North and South only.

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
next: 2S | 4+ spades
```

## Partnership Bidding (EW)

This should use a two-column layout for East and West only.

```auction
label: Defensive auction
seats: EW
E: KQJ3.AT7.KQ2.J54
W: A9876.654.A98.A3
1NT pass
2D pass
```

## Standard Markdown Still Works

Regular **bold**, *italic*, and `code` formatting works as normal.
Bridge blocks are rendered inline with the rest of your content.

- Lists work
- Links work: [marked docs](https://marked.js.org)
- Everything else is standard Markdown
