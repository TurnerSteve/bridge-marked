import { describe, expect, it } from 'vitest';
import { renderHand, renderDeal, renderAuction } from '../src/renderer.js';

const handData = {
  label: 'North',
  cards: { S: 'AKQ', H: '432', D: '876', C: 'J543' }
};

describe('renderer', () => {
  it('renders a single hand', () => {
    const svg = renderHand(handData);
    expect(svg).toContain('<svg');
    expect(svg).toContain('class="bridge-hand-svg"');
    expect(svg).toContain('North');
    expect(svg).toContain('AKQ');
    expect(svg).toContain('J543');
  });

  it('renders a deal with compass layout', () => {
    const data = {
      label: 'Example deal',
      boardNumber: 3,
      hands: {
        North: { S: 'AKQ', H: '432', D: '876', C: 'J543' },
        East: { S: '654', H: 'A987', D: 'QJ2', C: '65' },
        South: { S: 'J987', H: 'KQJ', D: '543', C: '987' },
        West: { S: '32', H: '65', D: 'AK9', C: 'AKQT2' }
      },
      bidding: [
        { north: '1NT', east: 'pass', south: '3NT', west: 'pass' }
      ],
      annotations: [{ bid: '1NT', meaning: '15-17 balanced' }]
    };
    const svg = renderDeal(data as any);
    expect(svg).toContain('<svg');
    expect(svg).toContain('class="bridge-deal-svg"');
    expect(svg).toContain('Example deal');
    expect(svg).toContain('1NT');
  });

  it('renders a pair auction with next bids', () => {
    const data = {
      label: 'Stayman',
      seats: 'NS',
      rounds: [
        { north: '1NT', east: '', south: '2C', west: '' },
        { north: '?', east: '', south: '', west: '' }
      ],
      hand1: { S: 'AKQ', H: 'J432', D: '876', C: 'J54' },
      hand2: { S: 'J987', H: 'KQ5', D: 'A43', C: 'A98' },
      nextBids: [
        { bid: '2D', meaning: 'No 4-card major' },
        { bid: '2H', meaning: '4+ hearts' }
      ]
    };
    const svg = renderAuction(data as any);
    expect(svg).toContain('<svg');
    expect(svg).toContain('class="bridge-bidding-svg"');
    expect(svg).toContain('Stayman');
    expect(svg).toContain('2C');
    expect(svg).toContain('1NT');
  });
});
