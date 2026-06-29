/**
 * HTML renderer for parsed bridge block data.
 * Produces self-contained HTML with CSS classes — no framework dependencies.
 */

import type { HandCards, HandData, HandsData, DealData, AuctionData, BiddingRound } from './types.js';

const SUITS = ['S', 'H', 'D', 'C'] as const;
const SUIT_SYM: Record<string, string> = { S: '♠', H: '♥', D: '♦', C: '♣' };
const SUIT_CLS: Record<string, string> = { S: 'bridge-suit-spade', H: 'bridge-suit-heart', D: 'bridge-suit-diamond', C: 'bridge-suit-club' };

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function spaceCards(cards: string): string {
  return cards.split('').join(' ');
}

// Board number → dealer / vulnerability (standard 16-board cycle)
function boardInfo(n: number): { dealer: string; vul: string } {
  const d = ['N', 'E', 'S', 'W'][(n - 1) % 4];
  const vulCycle = ['None', 'NS', 'EW', 'All', 'NS', 'EW', 'All', 'None', 'EW', 'All', 'None', 'NS', 'All', 'None', 'NS', 'EW'];
  return { dealer: d, vul: vulCycle[(n - 1) % 16] };
}

// ── Hand ─────────────────────────────────────────────────────────────────────

export function renderHand(data: HandData): string {
  const label = data.label ? `<div class="bridge-hand-label">${esc(data.label)}</div>` : '';
  const rows = SUITS.map(s =>
    `<div class="bridge-hand-row"><span class="${SUIT_CLS[s]}">${SUIT_SYM[s]}</span> <span class="bridge-cards">${spaceCards(data.cards[s]) || '—'}</span></div>`
  ).join('');
  return `<div class="bridge-hand">${label}${rows}</div>`;
}

// ── Hands ────────────────────────────────────────────────────────────────────

export function renderHands(data: HandsData): string {
  const title = data.title ? `<div class="bridge-hands-title">${esc(data.title)}</div>` : '';
  const perRow = data.perRow ?? 4;
  const hands = data.hands.map(h => renderHand(h)).join('');
  return `<div class="bridge-hands" style="--bridge-per-row:${perRow}">${title}<div class="bridge-hands-grid">${hands}</div></div>`;
}

// ── Deal ─────────────────────────────────────────────────────────────────────

export function renderDeal(data: DealData): string {
  const view = data.view ?? 'all';
  const info = data.boardNumber != null ? boardInfo(data.boardNumber) : null;
  const dealer = info?.dealer ?? (data.dealer ?? 'N').toUpperCase();
  const vul = info?.vul ?? 'None';

  const labelEl = data.label
    ? `<div class="bridge-deal-label">${esc(data.label)}</div>`
    : '';

  const subtitle = data.boardNumber != null
    ? `Board ${data.boardNumber} · Dealer: ${{ N: 'North', E: 'East', S: 'South', W: 'West' }[dealer] ?? dealer}`
    : `Dealer: ${{ N: 'North', E: 'East', S: 'South', W: 'West' }[dealer] ?? dealer}`;
  const subtitleEl = `<div class="bridge-deal-subtitle">${esc(subtitle)}</div>`;

  let handsEl: string;
  if (view === 'ns') {
    handsEl = `<div class="bridge-deal-ns">
      ${renderHand({ label: 'North', cards: data.hands.North })}
      ${renderHand({ label: 'South', cards: data.hands.South })}
    </div>`;
  } else if (view === 'ew') {
    handsEl = `<div class="bridge-deal-ew">
      ${renderHand({ label: 'West', cards: data.hands.West })}
      ${renderHand({ label: 'East', cards: data.hands.East })}
    </div>`;
  } else {
    handsEl = `<div class="bridge-deal-compass">
      <div class="bridge-deal-n">${renderHand({ label: 'North', cards: data.hands.North })}</div>
      <div class="bridge-deal-ew-row">
        <div class="bridge-deal-w">${renderHand({ label: 'West', cards: data.hands.West })}</div>
        <div class="bridge-deal-e">${renderHand({ label: 'East', cards: data.hands.East })}</div>
      </div>
      <div class="bridge-deal-s">${renderHand({ label: 'South', cards: data.hands.South })}</div>
    </div>`;
  }

  let biddingEl = '';
  if (data.bidding?.length) {
    biddingEl = renderAuctionTable(data.bidding, dealer, vul);
  }

  let annEl = '';
  if (data.showAnnotations !== false && data.annotations?.length) {
    annEl = renderAnnotations(data.annotations);
  }

  return `<div class="bridge-block bridge-deal">${labelEl}${subtitleEl}<div class="bridge-deal-body">${handsEl}${biddingEl ? `<div class="bridge-deal-auction">${biddingEl}${annEl}</div>` : ''}</div></div>`;
}

// ── Auction ──────────────────────────────────────────────────────────────────

function renderAuctionTable(rounds: BiddingRound[], dealer: string, vul: string): string {
  const dealerIdx = ['N', 'E', 'S', 'W'].indexOf(dealer);
  const nsVul = vul === 'NS' || vul === 'All';
  const ewVul = vul === 'EW' || vul === 'All';

  const headers = ['N', 'E', 'S', 'W'].map((s, i) => {
    const isVul = (i < 2 && i % 2 === 0) ? nsVul : (i % 2 === 1) ? ewVul : (i === 2) ? nsVul : ewVul;
    // N=0,S=2 → NS; E=1,W=3 → EW
    const vulClass = (['N', 'S'].includes(s) ? nsVul : ewVul) ? 'bridge-vul' : 'bridge-nonvul';
    return `<th class="${vulClass}">${s}</th>`;
  }).join('');

  const cols: Array<keyof BiddingRound> = ['north', 'east', 'south', 'west'];
  const rows = rounds.map((r, ri) => {
    const cells = cols.map((k, ci) => {
      let val = r[k] || '';
      if (ri === 0 && ci < dealerIdx) val = '—';
      return `<td>${esc(val)}</td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');

  return `<table class="bridge-auction-table"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
}

function renderAnnotations(annotations: { bid: string; meaning: string }[]): string {
  const rows = annotations.map(a =>
    `<tr><td class="bridge-ann-bid">${esc(a.bid)}</td><td>${esc(a.meaning)}</td></tr>`
  ).join('');
  return `<div class="bridge-annotations"><table><thead><tr><th>Bid</th><th>Meaning</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

export function renderAuction(data: AuctionData): string {
  const seats = (data.seats ?? 'NESW').toUpperCase();
  const isPair = seats === 'NS' || seats === 'EW';

  const labelEl = data.label
    ? `<div class="bridge-auction-label">${esc(data.label)}</div>`
    : '';

  let info = { dealer: 'N', vul: 'None' };
  if (!isPair && data.boardNumber != null) {
    info = boardInfo(data.boardNumber);
  } else {
    info = { dealer: data.dealer ?? 'N', vul: data.vul ?? 'None' };
  }

  let handsEl = '';
  if (isPair && (data.hand1 || data.hand2)) {
    const s1 = seats === 'EW' ? 'East' : 'North';
    const s2 = seats === 'EW' ? 'West' : 'South';
    handsEl = '<div class="bridge-auction-hands">';
    if (data.hand1) handsEl += renderHand({ label: s1, cards: data.hand1 });
    if (data.hand2) handsEl += renderHand({ label: s2, cards: data.hand2 });
    handsEl += '</div>';
  }

  let tableEl: string;
  if (isPair) {
    const cols: Array<keyof BiddingRound> = seats === 'NS' ? ['north', 'south'] : ['east', 'west'];
    const colLabels = seats === 'NS' ? ['N', 'S'] : ['E', 'W'];
    const headers = colLabels.map(l => `<th class="bridge-nonvul">${l}</th>`).join('');
    const rows = data.rounds.map(r => {
      const cells = cols.map(k => `<td>${esc(r[k] || '')}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    tableEl = `<table class="bridge-auction-table"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
  } else {
    tableEl = renderAuctionTable(data.rounds, info.dealer, info.vul);
  }

  let annEl = '';
  if (data.annotations?.length) {
    annEl = renderAnnotations(data.annotations);
  }

  let nextEl = '';
  if (data.nextBids?.length) {
    const nextLabel = data.nextBidsLabel ?? 'Continuations';
    const rows = data.nextBids.map(n =>
      `<tr><td class="bridge-ann-bid">${esc(n.bid)}</td><td>${esc(n.meaning)}</td></tr>`
    ).join('');
    nextEl = `<div class="bridge-next-bids"><div class="bridge-next-label">${esc(nextLabel)}</div><table><tbody>${rows}</tbody></table></div>`;
  }

  return `<div class="bridge-block bridge-auction">${labelEl}<div class="bridge-auction-body">${handsEl}<div>${tableEl}${annEl}</div></div>${nextEl}</div>`;
}
