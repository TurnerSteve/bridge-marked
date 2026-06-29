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

  it('renders NS and EW views as paired hands only', () => {
    const sharedHands = {
      North: { S: 'AKQ', H: '432', D: '876', C: 'J543' },
      East: { S: '654', H: 'A987', D: 'QJ2', C: '65' },
      South: { S: 'J987', H: 'KQJ', D: '543', C: '987' },
      West: { S: '32', H: '65', D: 'AK9', C: 'AKQT2' }
    };

    const nsSvg = renderDeal({ view: 'ns', hands: sharedHands } as any);
    expect(nsSvg).toContain('North');
    expect(nsSvg).toContain('South');
    expect(nsSvg).not.toContain('West');
    expect(nsSvg).not.toContain('East');

    const ewSvg = renderDeal({ view: 'ew', hands: sharedHands } as any);
    expect(ewSvg).toContain('West');
    expect(ewSvg).toContain('East');
    expect(ewSvg).not.toContain('North');
    expect(ewSvg).not.toContain('South');
  });

  it('renders partnership bidding using two seats for NS and EW', () => {
    const data = {
      label: 'Stayman',
      seats: 'NS',
      rounds: [
        { north: '1NT', east: '', south: '2C', west: '' },
        { north: '?', east: '', south: '', west: '' }
      ]
    };
    const nsSvg = renderAuction(data as any);
    expect(nsSvg).toContain('class="bridge-bidding-svg"');
    expect(nsSvg).toContain('>N</text>');
    expect(nsSvg).toContain('>S</text>');
    expect(nsSvg).not.toContain('>E</text>');
    expect(nsSvg).not.toContain('>W</text>');

    const ewSvg = renderAuction({ ...data, seats: 'EW' } as any);
    expect(ewSvg).toContain('>E</text>');
    expect(ewSvg).toContain('>W</text>');
    expect(ewSvg).not.toContain('>N</text>');
    expect(ewSvg).not.toContain('>S</text>');
  });

  it('renders EW partnership bidding with W as the first column', () => {
    const data = {
      label: 'Defense',
      seats: 'EW',
      rounds: [
        { north: '', east: '1NT', south: '', west: 'pass' }
      ]
    };
    const ewSvg = renderAuction(data as any);
    const westIndex = ewSvg.indexOf('>W</text>');
    const eastIndex = ewSvg.indexOf('>E</text>');
    expect(westIndex).toBeGreaterThan(-1);
    expect(eastIndex).toBeGreaterThan(-1);
    expect(westIndex).toBeLessThan(eastIndex);
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

  it('renders auction annotations and continuations tables to the right', () => {
    const data = {
      label: 'Alerts',
      seats: 'EW',
      rounds: [
        { north: '', east: '1NT', south: '', west: 'pass' },
        { north: '', east: '?', south: '', west: '' }
      ],
      annotations: [{ bid: '1NT', meaning: '15-17 balanced' }],
      nextBids: [{ bid: '2D', meaning: 'No 4-card major' }]
    };
    const html = renderAuction(data as any);
    expect(html).toContain('<svg');
    expect(html).toContain('Auction explanation');
    expect(html).toContain('Continuations');
    expect(html).toContain('1NT');
    expect(html).toContain('2D');
  });
});
