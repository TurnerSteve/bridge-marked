/**
 * SVG renderer for parsed bridge block data.
 * Produces self-contained SVG graphics — no framework dependencies.
 * Extracted from bridge-forge's sidecar-bridge-render.
 */

import type { HandCards, HandData, HandsData, DealData, AuctionData, BiddingRound } from './types.js';
import { renderHandSvg } from './svg-hand.js';
import { renderDealSvg } from './svg-deal.js';
import { renderBiddingSvg } from './svg-bidding.js';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Hand ─────────────────────────────────────────────────────────────────────

export function renderHand(data: HandData): string {
  return renderHandSvg({
    label: data.label,
    cards: data.cards
  });
}

// ── Hands ────────────────────────────────────────────────────────────────────

export function renderHands(data: HandsData): string {
  const title = data.title ? `<div class="bridge-hands-title">${esc(data.title)}</div>` : '';
  const perRow = data.perRow ?? 4;
  const hands = data.hands.map(h => renderHand(h)).join('');
  return `<div class="bridge-hands" style="--bridge-per-row:${perRow}"><div class="bridge-hands-grid">${title}${hands}</div></div>`;
}

// ── Deal ─────────────────────────────────────────────────────────────────────

export function renderDeal(data: DealData): string {
  const dealer = data.dealer ?? 'N';
  
  const dealSvg = renderDealSvg({
    label: data.label,
    dealer,
    hands: data.hands
  });

  let biddingEl = '';
  if (data.bidding?.length) {
    const rounds = data.bidding.map(r => ({
      north: r.north || '',
      south: r.south || '',
      east: r.east || '',
      west: r.west || ''
    }));
    biddingEl = renderBiddingSvg({
      dealer,
      rounds
    });
  }

  const annEl = '';  // Annotations not yet supported in SVG render

  return `<div class="bridge-block bridge-deal">${dealSvg}${biddingEl ? `<div class="bridge-deal-auction">${biddingEl}${annEl}</div>` : ''}</div>`;
}

// ── Auction ──────────────────────────────────────────────────────────────────

export function renderAuction(data: AuctionData): string {
  const rounds = data.rounds.map(r => ({
    north: r.north || '',
    south: r.south || '',
    east: r.east || '',
    west: r.west || ''
  }));

  const biddingSvg = renderBiddingSvg({
    label: data.label,
    dealer: data.dealer,
    rounds
  });

  return `<div class="bridge-block bridge-auction">${biddingSvg}</div>`;
}
