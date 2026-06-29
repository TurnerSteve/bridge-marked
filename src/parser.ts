/**
 * Parser for bridge fenced code blocks.
 * Accepts both compact line-based syntax and legacy JSON bodies.
 */

import type { HandCards, HandData, HandsData, DealData, AuctionData, BiddingRound, BridgeBlockType } from './types.js';

function lines(raw: string): string[] {
  return raw.split('\n').map(l => l.trim()).filter(Boolean);
}

function keyedLine(line: string): { key: string; value: string } | null {
  const m = line.match(/^([a-zA-Z][a-zA-Z0-9]*)\s*:\s*(.*)$/);
  if (!m) return null;
  return { key: m[1].toLowerCase(), value: m[2].trim() };
}

function bidTokens(line: string): string[] {
  return line.split(/\s+/).map(t => t.trim()).filter(Boolean);
}

export function cardsFromString(s: string): HandCards {
  const parts = s.split('.');
  return {
    S: (parts[0] ?? '').replace(/10/g, 'T').toUpperCase(),
    H: (parts[1] ?? '').replace(/10/g, 'T').toUpperCase(),
    D: (parts[2] ?? '').replace(/10/g, 'T').toUpperCase(),
    C: (parts[3] ?? '').replace(/10/g, 'T').toUpperCase()
  };
}

function parseHand(raw: string): HandData {
  const trimmed = raw.trim();
  const colonIdx = trimmed.lastIndexOf(':');
  if (colonIdx === -1) {
    return { cards: cardsFromString(trimmed) };
  }
  return {
    label: trimmed.slice(0, colonIdx).trim(),
    cards: cardsFromString(trimmed.slice(colonIdx + 1).trim())
  };
}

function parseHandsBlock(raw: string): HandsData {
  const ls = lines(raw);
  const data: HandsData = { hands: [] };
  for (const line of ls) {
    const kv = keyedLine(line);
    if (kv?.key === 'title') { data.title = kv.value; continue; }
    if (kv?.key === 'perrow') { data.perRow = Math.max(1, Math.min(6, parseInt(kv.value) || 4)); continue; }
    const h = parseHand(line);
    data.hands.push(h);
  }
  return data;
}

function parseDeal(raw: string): DealData {
  const ls = lines(raw);
  const data: DealData = {
    hands: {
      North: { S: '', H: '', D: '', C: '' },
      South: { S: '', H: '', D: '', C: '' },
      East: { S: '', H: '', D: '', C: '' },
      West: { S: '', H: '', D: '', C: '' }
    }
  };
  const biddingRounds: BiddingRound[] = [];

  for (const line of ls) {
    const kv = keyedLine(line);
    if (!kv) {
      const t = bidTokens(line);
      if (t.length >= 2) {
        biddingRounds.push({
          north: t[0] ?? '', east: t[1] ?? '', south: t[2] ?? '', west: t[3] ?? ''
        });
      }
      continue;
    }
    switch (kv.key) {
      case 'label': data.label = kv.value; break;
      case 'board': data.boardNumber = parseInt(kv.value, 10); break;
      case 'dealer': data.dealer = kv.value.toUpperCase(); break;
      case 'view': data.view = kv.value as DealData['view']; break;
      case 'annotations': data.showAnnotations = kv.value !== 'off' && kv.value !== 'false'; break;
      case 'n': case 'north': data.hands.North = cardsFromString(kv.value); break;
      case 'e': case 'east': data.hands.East = cardsFromString(kv.value); break;
      case 's': case 'south': data.hands.South = cardsFromString(kv.value); break;
      case 'w': case 'west': data.hands.West = cardsFromString(kv.value); break;
      case 'ann': {
        const pipe = kv.value.indexOf('|');
        if (pipe !== -1) {
          if (!data.annotations) data.annotations = [];
          data.annotations.push({ bid: kv.value.slice(0, pipe).trim(), meaning: kv.value.slice(pipe + 1).trim() });
        }
        break;
      }
    }
  }
  if (biddingRounds.length) data.bidding = biddingRounds;
  return data;
}

function parseAuction(raw: string, defaultSeats = 'NESW'): AuctionData {
  const ls = lines(raw);
  let seats = defaultSeats;
  for (const line of ls) {
    const kv = keyedLine(line);
    if (kv?.key === 'seats') { seats = kv.value.toUpperCase(); break; }
  }
  const data: AuctionData = { label: '', seats, rounds: [] };
  for (const line of ls) {
    const kv = keyedLine(line);
    if (!kv) {
      const t = bidTokens(line);
      if (seats === 'NS') {
        data.rounds.push({ north: t[0] ?? '', east: '', south: t[1] ?? '', west: '' });
      } else if (seats === 'EW') {
        data.rounds.push({ north: '', east: t[0] ?? '', south: '', west: t[1] ?? '' });
      } else {
        data.rounds.push({ north: t[0] ?? '', east: t[1] ?? '', south: t[2] ?? '', west: t[3] ?? '' });
      }
      continue;
    }
    switch (kv.key) {
      case 'label': data.label = kv.value; break;
      case 'seats': data.seats = kv.value.toUpperCase(); seats = data.seats; break;
      case 'board': data.boardNumber = parseInt(kv.value, 10); break;
      case 'dealer': data.dealer = kv.value.toUpperCase(); break;
      case 'vul': data.vul = kv.value; break;
      case 'annplacement': data.annotationPlacement = kv.value === 'right' ? 'right' : 'below'; break;
      case 'n': case 'north': case 'h1': data.hand1 = cardsFromString(kv.value); break;
      case 's': case 'south': case 'e': case 'east': case 'w': case 'west': case 'h2':
        data.hand2 = cardsFromString(kv.value); break;
      case 'ann': {
        const pipe = kv.value.indexOf('|');
        if (pipe !== -1) {
          if (!data.annotations) data.annotations = [];
          data.annotations.push({ bid: kv.value.slice(0, pipe).trim(), meaning: kv.value.slice(pipe + 1).trim() });
        }
        break;
      }
      case 'nextlabel': data.nextBidsLabel = kv.value; break;
      case 'next': {
        const pipe = kv.value.indexOf('|');
        if (pipe !== -1) {
          if (!data.nextBids) data.nextBids = [];
          data.nextBids.push({ bid: kv.value.slice(0, pipe).trim(), meaning: kv.value.slice(pipe + 1).trim() });
        }
        break;
      }
    }
  }
  return data;
}

export function parseBridgeBlock(type: BridgeBlockType, raw: string): unknown {
  const trimmed = raw.trim();
  if (trimmed.startsWith('{')) return JSON.parse(trimmed);
  switch (type) {
    case 'hand': return parseHand(trimmed);
    case 'hands': return parseHandsBlock(trimmed);
    case 'deal': return parseDeal(trimmed);
    case 'auction': return parseAuction(trimmed, 'NESW');
    case 'bidding': return parseAuction(trimmed, 'NESW');
    case 'pairbidding': return parseAuction(trimmed, 'NS');
  }
}
