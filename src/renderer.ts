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

function renderAnnotations(annotations?: { bid: string; meaning: string }[]): string {
  if (!annotations?.length) return '';
  const rows = annotations.map(a =>
    `      <tr><td class="bridge-ann-bid">${esc(a.bid)}</td><td>${esc(a.meaning)}</td></tr>`
  ).join('');
  return `<div class="bridge-annotations"><div class="bridge-annotations-title">Auction explanation</div>` +
    `<table><thead><tr><th>Alert</th><th>Meaning</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function renderNextBids(nextBids?: { bid: string; meaning: string }[], label?: string): string {
  if (!nextBids?.length) return '';
  const title = esc(label ?? 'Continuations');
  const rows = nextBids.map(n =>
    `      <tr><td class="bridge-ann-bid">${esc(n.bid)}</td><td>${esc(n.meaning)}</td></tr>`
  ).join('');
  return `<div class="bridge-next-bids"><div class="bridge-next-bids-title">${title}</div>` +
    `<table><thead><tr><th>Bid</th><th>Description</th></tr></thead><tbody>${rows}</tbody></table></div>`;
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
    view: data.view,
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

  const annEl = renderAnnotations(data.annotations);
  const details = [biddingEl, annEl].filter(Boolean).join('');

  return `<div class="bridge-block bridge-deal">${dealSvg}${details ? `<div class="bridge-deal-auction">${details}</div>` : ''}</div>`;
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
    seats: data.seats,
    rounds,
    annotations: data.annotations,
    nextBids: data.nextBids,
    nextBidsLabel: data.nextBidsLabel
  });

  return `<div class="bridge-block bridge-auction"><div class="bridge-auction-body"><div class="bridge-auction-table">${biddingSvg}</div></div></div>`;
}
